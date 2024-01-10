import * as argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";
import { RoleService } from "../services/role.service";
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { User } from "../models/user.model";
import { DoctorSpecialityMappingService } from "../services/doctorSpecialityMapping.service";
import { SpecialityService } from "../services/speciality.service";
import { DoctorSpecialityMapping } from "../models/doctorSpecialityMapping.model";
import { UserRoleMapping } from "../models/userRoleMapping.model";
import { getDoctorRoleIdEnv } from "../utils/dotenv";

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

  public postUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

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

      const roleNames: string[] = body.roleNames;

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

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public putUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;

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

      return reply.code(200).send({ success: true, message: "" });
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
