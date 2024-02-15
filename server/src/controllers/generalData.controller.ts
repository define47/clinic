import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { AppointmentService } from "../services/appointment.service";
import {
  getAdminRoleIdEnv,
  getDoctorRoleIdEnv,
  getPatientRoleIdEnv,
  getReceptionistRoleIdEnv,
} from "../utils/dotenv";

export class GeneralDataController {
  private readonly _userService: UserService;
  private readonly _userRoleMappingService: UserRoleMappingService;
  private readonly _medicalSpecialityService: MedicalSpecialityService;
  private readonly _appointmentService: AppointmentService;

  public constructor() {
    this._userService = new UserService();
    this._userRoleMappingService = new UserRoleMappingService();
    this._medicalSpecialityService = new MedicalSpecialityService();
    this._appointmentService = new AppointmentService();
  }

  public async getTotalCount(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query: any = request.query;

      let payload;

      // if (query.roleId)
      //   payload =
      //     await this._userRoleMappingService.getUserRoleMappingsCountByRoleId(
      //       query.roleId
      //     );
      // else if (query.entity) {
      //   if (query.entity === "medicalSpeciality")
      //     payload =
      //       await this._medicalSpecialityService.getMedicalSpecialityCount();
      //   else if (query.entity === "medicalProcedure") {
      //   } else if (query.entity === "appointment") {
      //     payload = await this._appointmentService.getAppointmentCountByPeriod(
      //       query.period
      //     );
      //   }

      if (query.entity === "admin")
        payload =
          await this._userRoleMappingService.getUserRoleMappingsCountByRoleId(
            getAdminRoleIdEnv()
          );
      else if (query.entity === "doctor")
        payload =
          await this._userRoleMappingService.getUserRoleMappingsCountByRoleId(
            getDoctorRoleIdEnv()
          );
      else if (query.entity === "patient")
        payload =
          await this._userRoleMappingService.getUserRoleMappingsCountByRoleId(
            getPatientRoleIdEnv()
          );
      else if (query.entity === "receptionist")
        payload =
          await this._userRoleMappingService.getUserRoleMappingsCountByRoleId(
            getReceptionistRoleIdEnv()
          );
      else if (query.entity === "medicalSpeciality")
        payload =
          await this._medicalSpecialityService.getMedicalSpecialityCount();
      else if (query.entity === "medicalProcedure") {
      } else if (query.entity === "appointment") {
        payload = await this._appointmentService.getAppointmentCountByPeriod(
          query.period,
          query.doctorId
        );
      }

      reply.code(200).send({ success: true, payload });
    } catch (error) {
      console.log(error);
    }
  }
}
