import { FastifyReply, FastifyRequest } from "fastify";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";

import { RoleService } from "../services/role.service";
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { User } from "../models/user.model";
import { DoctorSpecialityMappingService } from "../services/doctorSpecialityMapping.service";
import { SpecialityService } from "../services/speciality.service";
import { DoctorSpecialityMapping } from "../models/doctorSpecialityMapping.model";
import { UserRoleMapping } from "../models/userRoleMapping.model";
import { getDoctorRoleIdEnv } from "../utils/dotenv";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";

export class UserController {
  private readonly _userService: UserService;
  private readonly _roleService: RoleService;
  private readonly _userRoleMappingService: UserRoleMappingService;
  private readonly _doctorSpecialityMappingService: DoctorSpecialityMappingService;
  private readonly _specialityService: SpecialityService;

  public constructor() {
    this._userService = new UserService();
    this._roleService = new RoleService();
    this._userRoleMappingService = new UserRoleMappingService();
    this._doctorSpecialityMappingService = new DoctorSpecialityMappingService();
    this._specialityService = new SpecialityService();
  }

  private checkUserEmailValidity = async (userEmail: string) => {
    const user = await this._userService.getUserByEmail(userEmail);

    if (!user) return true;
    return false;
  };

  private checkUserPhoneNumberValidity = async (userPhoneNumber: string) => {
    const user = await this._userService.getUserByPhoneNumber(userPhoneNumber);

    if (!user) return true;
    return false;
  };

  public logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { redis } = fastifyServer;

      console.log("sessionId logout", request.sessionId.value);

      redis.sessionRedis.del(`sessionId:${request.sessionId.value}`);
      reply.clearCookie("sessionId");

      reply.code(200).send({ success: true, message: "logged out" });
    } catch (error) {
      console.log(error);
    }
  };

  public verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const signedCookieValue = request.unsignCookie(
        request.cookies.userSession!
      );

      console.log("reading", request.sessionId);

      reply
        .code(200)
        .send(`Signed Cookie Value:  ${JSON.stringify(signedCookieValue)}`);
    } catch (error) {}
  };

  public loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      // console.log(body);

      const userToLogin = await this._userService.getUserByEmail(
        body.userEmail
      );

      if (!userToLogin)
        reply.code(200).send({ success: false, message: "Failed Login email" });

      const passwordsMatch = await argon2.verify(
        userToLogin?.userEncryptedPassword!,
        body.userPassword
      );

      if (!passwordsMatch)
        reply
          .code(200)
          .send({ success: false, message: "Failed Login password" });

      const { redis } = fastifyServer;

      let roles = [];
      const userToLoginRoles =
        await this._userRoleMappingService.getUserRoleMappingsByUserId(
          userToLogin?.userId!
        );

      for (let i = 0; i < userToLoginRoles!.length; i++) {
        roles.push(
          (await this._roleService.getRoleById(userToLoginRoles![i].roleId))
            ?.roleName
        );
      }

      const sessionId = uuidv4();
      const sessionValue = {
        userId: userToLogin?.userId,
        userForename: userToLogin?.userForename,
        userSurname: userToLogin?.userSurname,
        userEmail: userToLogin?.userEmail,
        roles,
      };
      // console.log("created session id:", sessionId);

      await redis.sessionRedis.set(
        `sessionId:${sessionId}`,
        // `${userToLogin?.userForename} ${userToLogin?.userSurname} (${userToLogin?.userEmail})`
        JSON.stringify(sessionValue)
      );

      reply.setCookie("sessionId", sessionId, {
        signed: true,
        domain: "192.168.2.16",
        path: "/",
        expires: new Date(Date.now() + 80_400_000),
      });

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        `a user (${body.userEmail}) has logged in`
      );

      reply.code(200).send({
        success: true,
        message: "login successful",
        userRoles: userToLoginRoles,
      });
    } catch (error) {}
  };

  public postUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

      const roleNames: string[] = body.roleNames;

      for (let i = 0; i < roleNames.length; i++) {
        const role = await this._roleService.getRoleByName(roleNames[i]);
        if (!role)
          return reply.code(200).send({
            success: false,
            message: `role ${roleNames[i]} not found`,
          });
      }

      const isUserEmailValid = await this.checkUserEmailValidity(
        body.userEmail
      );

      const isUserPhoneNumberValid = await this.checkUserPhoneNumberValidity(
        body.userPhoneNumber
      );

      if (!isUserEmailValid) reply.code(200).send({ success: false });
      if (!isUserPhoneNumberValid) reply.code(200).send({ success: false });

      let postUser = await this._userService.createUser({
        userForename: body.userForename,
        userSurname: body.userSurname,
        userEmail: body.userEmail,
        userPhoneNumber: body.userPhoneNumber,
        userDateOfBirth: body.userDateOfBirth,
        userAddress: body.userAddress,
        userGender: body.userGender,
        userEncryptedPassword: await argon2.hash(body.userEncryptedPassword),
      });

      postUser = postUser as User;

      for (let i = 0; i < roleNames.length; i++) {
        const role = await this._roleService.getRoleByName(roleNames[i]);
        await this._userRoleMappingService.createUserRoleMapping({
          userId: postUser.userId,
          roleId: role?.roleId!,
        });

        if (role?.roleName === "doctor") {
          const specialityNames = body.specialityNames;
          for (let j = 0; j < specialityNames.length; j++) {
            const currentSpeciality =
              await this._specialityService.getSpecialityByName(
                specialityNames[j]
              );

            await this._doctorSpecialityMappingService.createDoctorSpecialityMapping(
              {
                doctorId: postUser.userId,
                specialityId: currentSpeciality?.specialityId!,
                isPrimarySpeciality: j === 0,
                isSecondarySpeciality: j === 1,
                isTertiarySpeciality: j === 2,
              }
            );
          }
        }
      }

      const { redis } = fastifyServer;

      await redis.publisher.publish(MESSAGE_CHANNEL, JSON.stringify(postUser));

      return reply
        .code(200)
        .send({ success: postUser !== undefined, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public putUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;
      const userSessionData = await redis.sessionRedis.get(
        `sessionId:${request.sessionId.value}`
      );
      const putUser = await this._userService.updateUser(body.userId, {
        userForename: body.userForename,
        userSurname: body.userSurname,
        userEmail: body.userEmail,
        userPhoneNumber: body.userPhoneNumber,
        userDateOfBirth: body.userDateOfBirth,
        userAddress: body.userAddress,
        userGender: body.userGender,
      });

      if (body.specialityNames) {
        const specialityNames = body.specialityNames;
        const currentDoctorSpecialities =
          await this._doctorSpecialityMappingService.getDoctorSpecialityMappingsByDoctorId(
            putUser?.userId!
          );
        console.log(putUser);

        for (let i = 0; i < specialityNames.length; i++) {
          const currentSpecialityToUpdateTo =
            await this._specialityService.getSpecialityByName(
              specialityNames[i]
            );
          if (
            currentDoctorSpecialities &&
            currentDoctorSpecialities[i].specialityId !==
              currentSpecialityToUpdateTo?.specialityId
          ) {
            await this._doctorSpecialityMappingService.updateDoctorSpecialityMapping(
              putUser?.userId!,
              currentDoctorSpecialities[i]?.specialityId!,
              currentSpecialityToUpdateTo?.specialityId!,
              i === 0,
              i === 1,
              i === 2
            );
          }
        }
      }

      return reply
        .code(200)
        .send({ success: true, message: "", userSessionData });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

      let user = await this._userService.getUserById(body.userId);

      let userRoleMappings =
        (await this._userRoleMappingService.getUserRoleMappingsByUserId(
          body.userId
        )) as UserRoleMapping[];

      for (let i = 0; i < userRoleMappings.length; i++) {
        if (userRoleMappings[i].roleId === getDoctorRoleIdEnv()) {
          await this._doctorSpecialityMappingService.deleteDoctorSpecialityMappingsByDoctorId(
            user?.userId!
          );
          break;
        }
      }

      await this._userRoleMappingService.deleteUserRoleMappingsByUserId(
        user?.userId!
      );

      await this._userService.deleteUser(user?.userId!);

      return reply.code(200).send({ success: true, message: "" });
      // const userRoleMappings = await this._userRoleMappingService.getUserRoleMappingsByUserId(user?.userId!)
      // for (let i = 0; i < userRoleMappings!.length; i++) {
      //     await this._userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId

      // }
    } catch (error) {}
  };
}
