import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";
import { getCurrentSessionData } from "../utils/utils";
import { getEntityMessage } from "../utils/serverLanguages";
import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";

export class MedicalSpecialityController {
  private readonly _medicalSpecialityService: MedicalSpecialityService;
  private readonly _doctorMedicalSpecialityMappingService: DoctorMedicalSpecialityMappingService;

  public constructor() {
    this._medicalSpecialityService = new MedicalSpecialityService();
    this._doctorMedicalSpecialityMappingService =
      new DoctorMedicalSpecialityMappingService();
  }

  public getAllMedicalSpecialities = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

      const payload =
        await this._medicalSpecialityService.getAllMedicalSpecialities(
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

  public postMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { redis } = fastifyServer;
      const currentSessionValue = await getCurrentSessionData(request);
      const body: any = request.body;

      const medicalSpeciality =
        await this._medicalSpecialityService.getMedicalSpecialityByName(
          body.medicalSpecialityName
        );

      if (medicalSpeciality)
        return reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            "medicalSpeciality",
            "create",
            "errorMedicalSpecialityName"
          ),
        });

      let medicalSpecialityToCreate =
        await this._medicalSpecialityService.createMedicalSpeciality({
          medicalSpecialityName: body.medicalSpecialityName,
        });

      if (medicalSpecialityToCreate)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createMedicalSpeciality",
            entity: "medicalSpeciality",
            data: medicalSpecialityToCreate,
          })
        );

      return reply.code(200).send({
        success: medicalSpecialityToCreate !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "medicalSpeciality",
          "create",
          medicalSpecialityToCreate !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  public putMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { redis } = fastifyServer;
      const currentSessionValue = await getCurrentSessionData(request);
      const body: any = request.body;

      const medicalSpeciality =
        await this._medicalSpecialityService.getMedicalSpecialityByName(
          body.medicalSpecialityName
        );

      if (medicalSpeciality)
        return reply.code(200).send({
          success: false,
          message: getEntityMessage(
            currentSessionValue.language.languageCode,
            "medicalSpeciality",
            "update",
            "errorMedicalSpecialityName"
          ),
        });

      let medicalSpecialityToUpdate =
        await this._medicalSpecialityService.updateMedicalSpeciality(
          body.medicalSpecialityId,
          {
            medicalSpecialityName: body.medicalSpecialityName,
          }
        );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "updateMedicalSpeciality",
          data: medicalSpecialityToUpdate,
        })
      );

      return reply.code(200).send({
        success: medicalSpecialityToUpdate !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "medicalSpeciality",
          "update",
          medicalSpecialityToUpdate !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {}
  };

  public deleteMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { redis } = fastifyServer;
      const currentSessionValue = await getCurrentSessionData(request);
      const body: any = request.body;

      const medicalSpeciality =
        await this._medicalSpecialityService.getMedicalSpecialityById(
          body.medicalSpecialityId
        );

      if (medicalSpeciality) {
        const hasDoctorSpeciality =
          await this._doctorMedicalSpecialityMappingService.hasDoctorSpeciality(
            body.medicalSpecialityId
          );
        if (hasDoctorSpeciality) {
          return reply.code(200).send({
            success: false,
            message: getEntityMessage(
              currentSessionValue.language.languageCode,
              "medicalSpeciality",
              "delete",
              "errorInUseMedicalSpecialityByDoctor"
            ),
          });
        }
      }

      let medicalSpecialityToDelete =
        await this._medicalSpecialityService.deleteMedicalSpecialityById(
          body.medicalSpecialityId
        );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteMedicalSpeciality",
          data: medicalSpecialityToDelete,
        })
      );

      return reply.code(200).send({
        success: medicalSpecialityToDelete !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "medicalSpeciality",
          "delete",
          medicalSpecialityToDelete !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {}
  };
}
