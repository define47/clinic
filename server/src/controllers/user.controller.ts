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
  getPatientRoleIdEnv,
  getReactClientIPAddressEnv,
  getReceptionistRoleIdEnv,
} from "../utils/dotenv";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";
import { LanguageService } from "../services/language.service";
import { UserPreferencesMappingService } from "../services/userPreferencesMapping.service";
import { MedicalSpeciality } from "../models/medicalSpeciality.model";
import { PatientService } from "../services/patient.service";
import {
  ServerLanguageCollection,
  getEntityMessage,
} from "../utils/serverLanguages";
import { getCurrentSessionData } from "../utils/utils";
import { AppointmentService } from "../services/appointment.service";

export class UserController {
  private readonly _userService: UserService;
  private readonly _roleService: RoleService;
  private readonly _userRoleMappingService: UserRoleMappingService;
  private readonly _doctorSpecialityMappingService: DoctorMedicalSpecialityMappingService;
  private readonly _medicalSpecialityService: MedicalSpecialityService;
  private readonly _languageService: LanguageService;
  private readonly _userPreferencesMappingService: UserPreferencesMappingService;
  private readonly _patientService: PatientService;
  private readonly _appointmentService: AppointmentService;

  public constructor() {
    this._userService = new UserService();
    this._roleService = new RoleService();
    this._userRoleMappingService = new UserRoleMappingService();
    this._doctorSpecialityMappingService =
      new DoctorMedicalSpecialityMappingService();
    this._medicalSpecialityService = new MedicalSpecialityService();
    this._languageService = new LanguageService();
    this._userPreferencesMappingService = new UserPreferencesMappingService();
    this._patientService = new PatientService();
    this._appointmentService = new AppointmentService();
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

        // "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8",
        // ["userForename"],
        // "",
        // 100,
        // 0,
        // "asc:userForename"
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

      let userPreferencesMapping =
        await this._userPreferencesMappingService.getUserPreferencesMappingByUserId(
          userToLogin?.userId!
        );
      console.log("userPreferencesMapping", userPreferencesMapping);

      if (userPreferencesMapping === undefined) {
        // const romanianLanguage = await this._languageService.getLanguageById(
        //   "197a489f-c736-5974-a13e-7c12db1729b8"
        // );

        const romanianLanguage = await this._languageService.getLanguageByName(
          "Romanian"
        );

        console.log(romanianLanguage);

        userPreferencesMapping =
          await this._userPreferencesMappingService.createUserPreferencesMapping(
            {
              userId: userToLogin?.userId!,
              languageId: romanianLanguage?.languageId!,
              isDarkModeOn: false,
            }
          );

        console.log("userPreferencesMapping", userPreferencesMapping);
      }

      const language = await this._languageService.getLanguageById(
        userPreferencesMapping?.languageId!
      );

      console.log("language", language);

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

      let doctorSpecialities = [];
      let doctorSpecialityNames = [];
      let doctorSpecialityIds = [];
      if (userRoleNames[0] === "doctor" || userRoleNames[1] === "doctor") {
        const userToLoginSpecialities =
          await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByDoctorId(
            userToLogin?.userId!
          );

        for (let i = 0; i < userToLoginSpecialities!.length; i++) {
          let currentSpeciality =
            await this._medicalSpecialityService.getMedicalSpecialityById(
              userToLoginSpecialities![i].medicalSpecialityId
            );
          doctorSpecialityNames.push(
            (
              await this._medicalSpecialityService.getMedicalSpecialityById(
                userToLoginSpecialities![i].medicalSpecialityId
              )
            )?.medicalSpecialityName
          );

          doctorSpecialityIds.push(
            (
              await this._medicalSpecialityService.getMedicalSpecialityById(
                userToLoginSpecialities![i].medicalSpecialityId
              )
            )?.medicalSpecialityId
          );

          doctorSpecialities.push({
            medicalSpecialityId: currentSpeciality?.medicalSpecialityId,
            medicalSpecialityName: currentSpeciality?.medicalSpecialityName,
          });
        }
      }

      const sessionId = uuidv4();
      // const sessionValue = {
      //   userId: userToLogin?.userId,
      //   userForename: userToLogin?.userForename,
      //   userSurname: userToLogin?.userSurname,
      //   userEmail: userToLogin?.userEmail,
      //   roleNames: userRoleNames,
      //   ...((userRoleNames[0] === "doctor" ||
      //     userRoleNames[1] === "doctor") && {
      //     specialityIds: doctorSpecialityIds,
      //   }),
      //   ...((userRoleNames[0] === "doctor" ||
      //     userRoleNames[1] === "doctor") && {
      //     specialityNames: doctorSpecialityNames,
      //   }),
      //   // specialityIds: doctorSpecialityIds,
      //   // specialityNames: doctorSpecialityNames,
      //   languageId: language?.languageId,
      //   languageCode: language?.languageCode,
      //   isDarkModeOn: userPreferencesMapping?.isDarkModeOn,
      // };
      // const sessionValue = {
      //   userId: userToLogin?.userId,
      //   userForename: userToLogin?.userForename,
      //   userSurname: userToLogin?.userSurname,
      //   userEmail: userToLogin?.userEmail,
      //   roleNames: userRoleNames,
      //   ...((userRoleNames[0] === "doctor" ||
      //     userRoleNames[1] === "doctor") && {
      //     medicalSpecialities: doctorSpecialities,
      //   }),
      //   languageId: language?.languageId,
      //   languageCode: language?.languageCode,
      //   isDarkModeOn: userPreferencesMapping?.isDarkModeOn,
      // };
      const sessionValue = {
        userId: userToLogin?.userId,
        userForename: userToLogin?.userForename,
        userSurname: userToLogin?.userSurname,
        userEmail: userToLogin?.userEmail,
        roleNames: userRoleNames,
        ...((userRoleNames[0] === "doctor" ||
          userRoleNames[1] === "doctor") && {
          medicalSpecialities: doctorSpecialities,
        }),
        language: {
          languageId: language?.languageId,
          languageCode: language?.languageCode,
          languageName: language?.languageName,
        },
        isDarkModeOn: userPreferencesMapping?.isDarkModeOn,
      };

      console.log("here", sessionValue);

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

  public postUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { redis } = fastifyServer;
      const currentSessionValue = await getCurrentSessionData(request);
      const body: any = request.body;
      console.log("🚀 ~ UserController ~ postUser= ~ body:", body);

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
              specialityIds[i].split(":")[1]
            );
          if (!speciality)
            return reply.code(200).send({
              success: false,
              message: `speciality ${specialityIds[i]} not found`,
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

      if (!isUserEmailValid) {
        reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            foundRoles[0] as keyof ServerLanguageCollection,
            "create",
            "errorEmail"
          ),
        });
      }
      if (!isUserPhoneNumberValid) {
        reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            foundRoles[0] as keyof ServerLanguageCollection,
            "create",
            "errorPhoneNumber"
          ),
        });
      }

      let postUser = await this._userService.createUser({
        userForename: body.userForename,
        userSurname: body.userSurname,
        userEmail: body.userEmail,
        userPhoneNumber: body.userPhoneNumber,
        userDateOfBirth: body.userDateOfBirth,
        userAddress: body.userAddress,
        userGender: body.userGender,
        userEncryptedPassword: await argon2.hash(body.userEncryptedPassword),
        isUserEmailActivated: false,
        isUserApprovedByAdmin: false,
        isUserSuspended: false,
        isUserBanned: false,
      });

      postUser = postUser as User;

      for (let i = 0; i < roleIds.length; i++) {
        await this._userRoleMappingService.createUserRoleMapping({
          userId: postUser.userId,
          roleId: roleIds[i],
        });

        // * if doctor
        if (roleIds[i] === getDoctorRoleIdEnv()) {
          for (let j = 0; j < specialityIds.length; j++) {
            let current = specialityIds[j].split(":");
            let currentMedicalSpecialityRank = current[0];
            let currentMedicalSpecialityId = current[1];
            // await this._doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
            //   {
            //     userId: postUser.userId,
            //     medicalSpecialityId: specialityIds[j],
            //     isPrimaryMedicalSpeciality: j === 0,
            //     isSecondaryMedicalSpeciality: j === 1,
            //     isTertiaryMedicalSpeciality: j === 2,
            //   }
            // );

            await this._doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
              {
                userId: postUser.userId,
                medicalSpecialityId: currentMedicalSpecialityId,
                isPrimaryMedicalSpeciality:
                  currentMedicalSpecialityRank === "primary",
                isSecondaryMedicalSpeciality:
                  currentMedicalSpecialityRank === "secondary",
                isTertiaryMedicalSpeciality:
                  currentMedicalSpecialityRank === "tertiary",
              }
            );
          }
        } else if (roleIds[i] === getPatientRoleIdEnv()) {
          await this._patientService.createPatient({
            patientId: postUser?.userId!,
            patientCNP: body.patientCNP,
          });
        }
      }

      console.log("🚀 ~ UserController ~ postUser= ~ roleIds:", roleIds);
      console.log("🚀 ~ UserController ~ postUser= ~ foundRoles:", foundRoles);
      console.log(
        "🚀 ~ UserController ~ postUser= ~ specialityIds:",
        specialityIds
      );
      console.log(
        "🚀 ~ UserController ~ postUser= ~ foundMedicalSpecialities:",
        foundMedicalSpecialities
      );
      console.log("🚀 ~ UserController ~ postUser= ~ postUser:", postUser);

      if (postUser)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createUser",
            data: {
              user:
                roleIds[0] === getPatientRoleIdEnv()
                  ? { ...postUser, userCNP: body.patientCNP }
                  : postUser,
              roles: foundRoles,
              medicalSpecialities: foundMedicalSpecialities,
            },
          })
        );

      return reply.code(200).send({
        success: postUser !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "patient",
          "create",
          postUser !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {
      // console.log("myerror", error as Error);

      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public putUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body: any = request.body;
      const currentSessionValue = await getCurrentSessionData(request);
      const { redis } = fastifyServer;

      let foundMedicalSpecialities: string[] = [];

      const isUserEmailValid = await this.checkUserEmailValidity(
        body.userEmail
      );

      const isUserPhoneNumberValid = await this.checkUserPhoneNumberValidity(
        body.userPhoneNumber
      );

      const foundRoles =
        await this._userRoleMappingService.getUserRoleMappingsByUserId(
          body.userId
        );
      const role = await this._roleService.getRoleById(foundRoles![0].roleId!);

      if (!isUserEmailValid) {
        reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            role?.roleName as keyof ServerLanguageCollection,
            "update",
            "errorEmail"
          ),
        });
      }
      if (!isUserPhoneNumberValid) {
        reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            role?.roleName as keyof ServerLanguageCollection,
            "update",
            "errorPhoneNumber"
          ),
        });
      }

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

      if (body.userCNP) {
        await this._patientService.updatePatient(putUser?.userId!, {
          patientCNP: body.userCNP,
        });
      }

      if (body.specialityIds && body.specialityIds.length !== 0) {
        const specialityIds = body.specialityIds;
        const currentDoctorMedicalSpecialitiesMappings =
          await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByDoctorId(
            putUser?.userId!
          );
        // console.log(currentDoctorMedicalSpecialitiesMappings);

        if (currentDoctorMedicalSpecialitiesMappings)
          for (
            let i = 0;
            i < currentDoctorMedicalSpecialitiesMappings.length;
            i++
          ) {
            for (let j = 0; j < specialityIds.length; j++) {
              let currentData = specialityIds[j].split(":");
              console.log("currentdata", currentData[0], currentData[1]);

              if (
                currentData[0] === "primary" &&
                currentDoctorMedicalSpecialitiesMappings[i]
                  .isPrimaryMedicalSpeciality
              ) {
                // doctorMedicalSpecialityMappingToUpdate =
                //   await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByMappingId(
                //     currentDoctorMedicalSpecialitiesMappings[i]
                //       .doctorMedicalSpecialityMappingId
                //   );

                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  currentDoctorMedicalSpecialitiesMappings[i]
                    .doctorMedicalSpecialityMappingId,
                  {
                    medicalSpecialityId: currentData[1],
                    isPrimaryMedicalSpeciality: true,
                    isSecondaryMedicalSpeciality: false,
                    isTertiaryMedicalSpeciality: false,
                  }
                );
              } else if (
                currentData[0] === "secondary" &&
                currentDoctorMedicalSpecialitiesMappings[i]
                  .isSecondaryMedicalSpeciality
              ) {
                // doctorMedicalSpecialityMappingToUpdate =
                //   await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByMappingId(
                //     currentDoctorMedicalSpecialitiesMappings[i]
                //       .doctorMedicalSpecialityMappingId
                //   );

                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  currentDoctorMedicalSpecialitiesMappings[i]
                    .doctorMedicalSpecialityMappingId,
                  {
                    medicalSpecialityId: currentData[1],
                    isPrimaryMedicalSpeciality: false,
                    isSecondaryMedicalSpeciality: true,
                    isTertiaryMedicalSpeciality: false,
                  }
                );
              } else if (
                currentData[0] === "tertiary" &&
                currentDoctorMedicalSpecialitiesMappings[i]
                  .isTertiaryMedicalSpeciality
              ) {
                // doctorMedicalSpecialityMappingToUpdate =
                //   await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByMappingId(
                //     currentDoctorMedicalSpecialitiesMappings[i]
                //       .doctorMedicalSpecialityMappingId
                //   );

                await this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
                  currentDoctorMedicalSpecialitiesMappings[i]
                    .doctorMedicalSpecialityMappingId,
                  {
                    medicalSpecialityId: currentData[1],
                    isPrimaryMedicalSpeciality: false,
                    isSecondaryMedicalSpeciality: false,
                    isTertiaryMedicalSpeciality: true,
                  }
                );
              }
            }
          }
      }

      const updatedDoctorMedicalSpecialityMappings =
        await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByDoctorId(
          putUser?.userId!
        );

      if (updatedDoctorMedicalSpecialityMappings)
        for (
          let i = 0;
          i < updatedDoctorMedicalSpecialityMappings.length;
          i++
        ) {
          const medicalSpeciality =
            await this._medicalSpecialityService.getMedicalSpecialityById(
              updatedDoctorMedicalSpecialityMappings[i]?.medicalSpecialityId!
            );

          foundMedicalSpecialities.push(
            updatedDoctorMedicalSpecialityMappings[i]
              ?.isPrimaryMedicalSpeciality
              ? medicalSpeciality?.medicalSpecialityName + " (P)"
              : updatedDoctorMedicalSpecialityMappings[i]
                  ?.isSecondaryMedicalSpeciality
              ? medicalSpeciality?.medicalSpecialityName + " (S)"
              : updatedDoctorMedicalSpecialityMappings[i]
                  ?.isTertiaryMedicalSpeciality
              ? medicalSpeciality?.medicalSpecialityName + " (T)"
              : ""
          );
        }

      console.log("updated MedicalSpecialities", foundMedicalSpecialities);

      const roles =
        await this._userRoleMappingService.getUserRoleMappingsByUserId(
          putUser?.userId!
        );

      let data;

      console.log("roles", roles);
      if (roles) {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].roleId === getDoctorRoleIdEnv()) {
            data = {
              user: putUser,
              roles: ["doctor"],
              medicalSpecialities: foundMedicalSpecialities,
            };
          } else if (roles[i].roleId === getPatientRoleIdEnv()) {
            data = {
              user: { ...putUser, userCNP: body.userCNP },
              roles: ["patient"],
            };
          } else if (roles[i].roleId === getReceptionistRoleIdEnv()) {
            data = {
              user: { ...putUser },
              roles: ["receptionist"],
            };
          }
        }
      }

      // {
      //   user: putUser,
      //   ...(foundMedicalSpecialities.length !== 0 && {
      //     roles: ["doctor"],
      //   }),
      //   ...(body.userCNP && {
      //     roles: ["patient"],
      //   }),
      //   medicalSpecialities: foundMedicalSpecialities,
      // }

      if (putUser)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "updateUser",
            data,
          })
        );

      return reply.code(200).send({
        success: putUser !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          role?.roleName as keyof ServerLanguageCollection,
          "update",
          putUser !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { redis } = fastifyServer;
      const body: any = request.body;
      console.log("body delete user", body);

      const currentSessionValue = await getCurrentSessionData(request);

      let user = await this._userService.getUserById(body.userId);

      const foundRoles =
        await this._userRoleMappingService.getUserRoleMappingsByUserId(
          body.userId
        );
      const firstRole = await this._roleService.getRoleById(
        foundRoles![0].roleId!
      );
      let secondRole;

      if (foundRoles?.length === 2)
        secondRole = await this._roleService.getRoleById(foundRoles[1].roleId!);

      console.log("🚀 ~ UserController ~ publicdeleteUser ~ role:", firstRole);

      if (
        firstRole?.roleName === "doctor" ||
        secondRole?.roleName === "doctor"
      ) {
        const hasDoctorAppointments =
          await this._appointmentService.hasDoctorAppointments(body.userId);
        console.log(
          "🚀 ~ UserController ~ publicdeleteUser ~ hasDoctorAppointments:",
          hasDoctorAppointments ? "true" : "false"
        );

        if (hasDoctorAppointments)
          return reply.code(200).send({
            success: false,
            message: getEntityMessage(
              currentSessionValue.language.languageCode,
              "doctor",
              "delete",
              "errorDoctorWithAppointments"
            ),
          });
      }

      let userRoleMappings =
        (await this._userRoleMappingService.getUserRoleMappingsByUserId(
          body.userId
        )) as UserRoleMapping[];

      for (let i = 0; i < userRoleMappings.length; i++) {
        if (userRoleMappings[i].roleId === getDoctorRoleIdEnv()) {
          const doctorMedicalSpecialityMappings =
            await this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingByDoctorId(
              user?.userId!
            );

          for (let i = 0; i < doctorMedicalSpecialityMappings!.length; i++) {
            await this._doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingByMappingId(
              doctorMedicalSpecialityMappings![i]
                .doctorMedicalSpecialityMappingId
            );
          }

          break;
        } else if (userRoleMappings[i].roleId === getPatientRoleIdEnv()) {
          await this._patientService.deletePatient(user?.userId!);
        }
      }

      await this._userRoleMappingService.deleteUserRoleMappingsByUserId(
        user?.userId!
      );

      const userToDelete = await this._userService.deleteUser(user?.userId!);

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteUser",
          data: userToDelete,
        })
      );

      return reply.code(200).send({
        success: true,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          firstRole?.roleName as keyof ServerLanguageCollection,
          "delete",
          "success"
        ),
      });
    } catch (error) {}
  };
}
