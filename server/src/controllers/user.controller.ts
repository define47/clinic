import { FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";
import * as argon2 from "argon2";
import * as clc from "cli-color";

import { RoleService } from "../services/role.service";
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { User } from "../models/user.model";
import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { DoctorMedicalSpecialityMapping } from "../models/doctorMedicalSpecialityMapping.model";
import { UserRoleMapping } from "../models/userRoleMapping.model";
import {
  getDoctorRoleIdEnv,
  getReactClientIPAddressEnv,
} from "../utils/dotenv";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";
import { LanguageService } from "../services/language.service";
import { UserPreferencesMappingService } from "../services/userPreferencesMapping.service";
import { MedicalSpeciality } from "../models/medicalSpeciality.model";

export class UserController {
  private readonly _userService: UserService;
  private readonly _roleService: RoleService;
  private readonly _userRoleMappingService: UserRoleMappingService;
  private readonly _doctorSpecialityMappingService: DoctorMedicalSpecialityMappingService;
  private readonly _medicalSpecialityService: MedicalSpecialityService;
  private readonly _languageService: LanguageService;
  private readonly _userPreferencesMappingService: UserPreferencesMappingService;

  public constructor() {
    this._userService = new UserService();
    this._roleService = new RoleService();
    this._userRoleMappingService = new UserRoleMappingService();
    this._doctorSpecialityMappingService =
      new DoctorMedicalSpecialityMappingService();
    this._medicalSpecialityService = new MedicalSpecialityService();
    this._languageService = new LanguageService();
    this._userPreferencesMappingService = new UserPreferencesMappingService();
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

  public retrieveAllUsersRelatedData = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

      const payload = await this._userRoleMappingService.getAllUsersRelatedData(
        query.roleId,
        query.searchBy.split(","),
        query.searchQuery,
        parseInt(query.limit),
        parseInt(query.page),
        query.orderBy
      );

      reply.code(200).send({ success: true, payload });
    } catch (error) {
      console.log(error);
    }
  };

  public logoutUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { redis } = fastifyServer;

      console.log("sessionId logout", request.cookieData.value);

      await redis.sessionRedis.del(`sessionId:${request.cookieData.value}`);
      reply.clearCookie("sessionId");

      reply.code(200).send({ success: true, message: "logged out" });
    } catch (error) {
      console.log(error);
    }
  };

  public verifyUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // console.log("helloooo", request.cookieData);

      // const signedCookieValue = request.unsignCookie(
      //   request.cookieData!
      // );

      // console.log("reading", signedCookieValue);

      const { redis } = fastifyServer;

      const payload = await redis.sessionRedis.get(
        `sessionId:${request.cookieData.value}`
      );

      if (payload) reply.code(200).send({ success: true, payload });
      reply.code(200).send({ success: false, payload });
      // console.log(payload);

      // `Signed Cookie Value:  ${JSON.stringify(data)}`
    } catch (error) {
      console.log(error);
    }
  };

  public loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

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

      const userPreferencesMapping =
        await this._userPreferencesMappingService.getUserPreferencesMappingByUserId(
          userToLogin?.userId!
        );

      if (userPreferencesMapping === undefined) {
        const romanianLanguage = await this._languageService.getLanguageById(
          "197a489f-c736-5974-a13e-7c12db1729b8"
        );

        console.log(romanianLanguage);

        await this._userPreferencesMappingService.createUserPreferencesMapping({
          userId: userToLogin?.userId!,
          languageId: romanianLanguage?.languageId!,
          isDarkModeOn: false,
        });
      }

      const language = await this._languageService.getLanguageById(
        userPreferencesMapping?.languageId!
      );

      console.log(language);

      let userRoleNames = [];
      const userToLoginRoles =
        await this._userRoleMappingService.getUserRoleMappingsByUserId(
          userToLogin?.userId!
        );

      for (let i = 0; i < userToLoginRoles!.length; i++) {
        userRoleNames.push(
          (await this._roleService.getRoleById(userToLoginRoles![i].roleId))
            ?.roleName
        );
      }

      let doctorSpecialityNames = [];
      if (userRoleNames[0] === "doctor" || userRoleNames[1] === "doctor") {
        const userToLoginSpecialities =
          await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(
            userToLogin?.userId!
          );

        for (let i = 0; i < userToLoginSpecialities!.length; i++) {
          doctorSpecialityNames.push(
            (
              await this._medicalSpecialityService.getMedicalSpecialityById(
                userToLoginSpecialities![i].medicalSpecialityId
              )
            )?.medicalSpecialityName
          );
        }
      }

      const sessionId = uuidv4();
      const sessionValue = {
        userId: userToLogin?.userId,
        userForename: userToLogin?.userForename,
        userSurname: userToLogin?.userSurname,
        userEmail: userToLogin?.userEmail,
        roleNames: userRoleNames,
        specialityNames: doctorSpecialityNames,
        languageCode: language?.languageCode,
        isDarkModeOn: userPreferencesMapping?.isDarkModeOn,
      };

      console.log(sessionValue);

      console.log(`${clc.cyan("created session:")} get sessionId:${sessionId}`);

      await redis.sessionRedis.set(
        `sessionId:${sessionId}`,
        // `${userToLogin?.userForename} ${userToLogin?.userSurname} (${userToLogin?.userEmail})`
        JSON.stringify(sessionValue)
      );

      reply.setCookie("sessionId", sessionId, {
        signed: true,
        domain: getReactClientIPAddressEnv(),
        path: "/",
        expires: new Date(Date.now() + 80_400_000),
      });

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({ message: `a user (${body.userEmail}) has logged in` })
      );

      reply.code(200).send({
        success: true,
        message: "login successful",
        userRoles: userToLoginRoles,
        userPreferencesMapping,
      });
    } catch (error) {}
  };

  // public postUser = async (request: FastifyRequest, reply: FastifyReply) => {
  //   try {
  //     const body: any = request.body;

  //     console.log(body);

  //     const roleNames: string[] = body.roleNames;

  //     for (let i = 0; i < roleNames.length; i++) {
  //       const role = await this._roleService.getRoleByName(roleNames[i]);
  //       if (!role)
  //         return reply.code(200).send({
  //           success: false,
  //           message: `role ${roleNames[i]} not found`,
  //         });
  //     }

  //     const isUserEmailValid = await this.checkUserEmailValidity(
  //       body.userEmail
  //     );

  //     const isUserPhoneNumberValid = await this.checkUserPhoneNumberValidity(
  //       body.userPhoneNumber
  //     );

  //     if (!isUserEmailValid) reply.code(200).send({ success: false });
  //     if (!isUserPhoneNumberValid) reply.code(200).send({ success: false });

  //     let postUser = await this._userService.createUser({
  //       userForename: body.userForename,
  //       userSurname: body.userSurname,
  //       userEmail: body.userEmail,
  //       userPhoneNumber: body.userPhoneNumber,
  //       userDateOfBirth: body.userDateOfBirth,
  //       userAddress: body.userAddress,
  //       userGender: body.userGender,
  //       userEncryptedPassword: await argon2.hash(body.userEncryptedPassword),
  //     });

  //     postUser = postUser as User;

  //     for (let i = 0; i < roleNames.length; i++) {
  //       const role = await this._roleService.getRoleByName(roleNames[i]);
  //       await this._userRoleMappingService.createUserRoleMapping({
  //         userId: postUser.userId,
  //         roleId: role?.roleId!,
  //       });

  //       if (role?.roleName === "doctor") {
  //         const specialityNames = body.specialityNames;
  //         for (let j = 0; j < specialityNames.length; j++) {
  //           const currentSpeciality =
  //             await this._medicalSpecialityService.getMedicalSpecialityByName(
  //               specialityNames[j]
  //             );

  //           await this._doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
  //             {
  //               userId: postUser.userId,
  //               medicalSpecialityId: currentSpeciality?.medicalSpecialityId!,
  //               isPrimaryMedicalSpeciality: j === 0,
  //               isSecondaryMedicalSpeciality: j === 1,
  //               isTertiaryMedicalSpeciality: j === 2,
  //             }
  //           );
  //         }
  //       }
  //     }

  //     const { redis } = fastifyServer;

  //     await redis.publisher.publish(MESSAGE_CHANNEL, JSON.stringify(postUser));

  //     return reply
  //       .code(200)
  //       .send({ success: postUser !== undefined, message: "" });
  //   } catch (error) {
  //     console.log(error);
  //     return reply.code(400).send({ error: (error as Error).message });
  //   }
  // };

  public postUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

      console.log("bodypostuser", body);

      const roleIds: string[] = body.roleIds;
      let foundRoles: string[] = [];
      let foundMedicalSpecialities: string[] = [];
      const specialityIds = body.specialityIds?.filter(function (
        value: string
      ) {
        return value !== "";
      });

      for (let i = 0; i < roleIds.length; i++) {
        const role = await this._roleService.getRoleById(roleIds[i]);

        if (!role)
          return reply.code(200).send({
            success: false,
            message: `role ${roleIds[i]} not found`,
          });
        foundRoles.push(role?.roleName);
      }

      if (specialityIds)
        for (let i = 0; i < specialityIds.length; i++) {
          const speciality =
            await this._medicalSpecialityService.getMedicalSpecialityById(
              specialityIds[i]
            );
          if (!speciality)
            return reply.code(200).send({
              success: false,
              message: `speciality ${roleIds[i]} not found`,
            });
          foundMedicalSpecialities.push(
            // medicalSpecialityId:
            i === 0
              ? speciality.medicalSpecialityName + " (P)"
              : i === 1
              ? speciality.medicalSpecialityName + " (S)"
              : i === 2
              ? speciality.medicalSpecialityName + " (T)"
              : ""
            // medicalSpecialityName: speciality.medicalSpecialityName,
          );
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

      for (let i = 0; i < roleIds.length; i++) {
        await this._userRoleMappingService.createUserRoleMapping({
          userId: postUser.userId,
          roleId: roleIds[i],
        });

        // * if doctor
        if (roleIds[i] === getDoctorRoleIdEnv()) {
          console.log("specialityIds", specialityIds);

          for (let j = 0; j < specialityIds.length; j++) {
            console.log("specialityIds[i]", specialityIds[i]);

            await this._doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
              {
                userId: postUser.userId,
                medicalSpecialityId: specialityIds[j],
                isPrimaryMedicalSpeciality: j === 0,
                isSecondaryMedicalSpeciality: j === 1,
                isTertiaryMedicalSpeciality: j === 2,
              }
            );
          }
        }
      }

      const { redis } = fastifyServer;

      if (postUser)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createUser",
            data: {
              user: postUser,
              roles: foundRoles,
              medicalSpecialities: foundMedicalSpecialities,
            },
          })
        );

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
        `sessionId:${request.cookieData.value}`
      );
      let foundMedicalSpecialities: string[] = [];

      const putUser = await this._userService.updateUser(body.userId, {
        userForename: body.userForename,
        userSurname: body.userSurname,
        userEmail: body.userEmail,
        userPhoneNumber: body.userPhoneNumber,
        userDateOfBirth: body.userDateOfBirth,
        userAddress: body.userAddress,
        userGender: body.userGender,
      });

      console.log(body.specialityIds);

      console.log(
        await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(
          putUser?.userId!
        )
      );

      // * add pk to doctor medical speciality mapping

      if (body.specialityIds) {
        const specialityIds = body.specialityIds;
        const currentDoctorSpecialities =
          await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(
            putUser?.userId!
          );
        if (currentDoctorSpecialities)
          for (let i = 0; i < specialityIds.length; i++) {
            let current = specialityIds[i].split(":");

            if (current[0] === "tertiary") {
              const currentTertiaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByRank(
                  putUser?.userId!,
                  "tertiary"
                );

              const tertiaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  putUser?.userId!,
                  currentTertiaryDoctorMedicalSpecialityMappingToUpdate!
                    .medicalSpecialityId,
                  current[1],
                  false,
                  false,
                  current[0] === "tertiary"
                );
            } else if (current[0] === "secondary") {
              const currentSecondaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByRank(
                  putUser?.userId!,
                  "secondary"
                );

              const secondaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  putUser?.userId!,
                  currentSecondaryDoctorMedicalSpecialityMappingToUpdate!
                    .medicalSpecialityId,
                  current[1],
                  false,
                  current[0] === "secondary",
                  false
                );
            } else if (current[0] === "primary") {
              const currentPrimaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByRank(
                  putUser?.userId!,
                  "primary"
                );

              const primaryDoctorMedicalSpecialityMappingToUpdate =
                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  putUser?.userId!,
                  currentPrimaryDoctorMedicalSpecialityMappingToUpdate!
                    .medicalSpecialityId,
                  current[1],
                  current[0] === "primary",
                  false,
                  false
                );

              console.log(
                "primaryDoctorMedicalSpecialityMappingToUpdate",
                primaryDoctorMedicalSpecialityMappingToUpdate
              );
            }

            const mappings =
              await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(
                putUser?.userId!
              );

            if (mappings)
              for (let i = 0; i < mappings.length; i++) {
                const medicalSpeciality =
                  await this._medicalSpecialityService.getMedicalSpecialityById(
                    mappings[i]?.medicalSpecialityId!
                  );

                foundMedicalSpecialities.push(
                  mappings[i]?.isPrimaryMedicalSpeciality
                    ? medicalSpeciality?.medicalSpecialityName + " (P)"
                    : mappings[i]?.isSecondaryMedicalSpeciality
                    ? medicalSpeciality?.medicalSpecialityName + " (S)"
                    : mappings[i]?.isTertiaryMedicalSpeciality
                    ? medicalSpeciality?.medicalSpecialityName + " (T)"
                    : ""
                );
              }
          }
      }

      if (putUser)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "updateUser",
            data: {
              user: putUser,
              ...(foundMedicalSpecialities.length !== 0 && {
                roles: ["doctor"],
              }),
              medicalSpecialities: foundMedicalSpecialities,
            },
          })
        );

      return reply
        .code(200)
        .send({ success: putUser !== undefined, message: "", userSessionData });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { redis } = fastifyServer;
      const body: any = request.body;

      let user = await this._userService.getUserById(body.userId);

      let userRoleMappings =
        (await this._userRoleMappingService.getUserRoleMappingsByUserId(
          body.userId
        )) as UserRoleMapping[];

      for (let i = 0; i < userRoleMappings.length; i++) {
        if (userRoleMappings[i].roleId === getDoctorRoleIdEnv()) {
          await this._doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingsByDoctorId(
            user?.userId!
          );
          break;
        }
      }

      await this._userRoleMappingService.deleteUserRoleMappingsByUserId(
        user?.userId!
      );

      const userToDelete = await this._userService.deleteUser(user?.userId!);
      console.log("userToDelete", userToDelete);

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteUser",
          data: userToDelete,
        })
      );

      return reply.code(200).send({ success: true, message: "" });
      // const userRoleMappings = await this._userRoleMappingService.getUserRoleMappingsByUserId(user?.userId!)
      // for (let i = 0; i < userRoleMappings!.length; i++) {
      //     await this._userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId

      // }
    } catch (error) {}
  };
}
