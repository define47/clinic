import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalProcedureService } from "../services/medicalProcedure.service";
import { MedicalSpecialityMedicalProcedureMappingService } from "../services/medicalSpecialityMedicalProcedureMapping.service";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";

export class MedicalProcedureController {
  private readonly _medicalProcedureService: MedicalProcedureService;
  private readonly _medicalSpecialityMedicalProcedureMappingService: MedicalSpecialityMedicalProcedureMappingService;
  public constructor() {
    this._medicalProcedureService = new MedicalProcedureService();
    this._medicalSpecialityMedicalProcedureMappingService =
      new MedicalSpecialityMedicalProcedureMappingService();
  }

  public getMedicalProceduresByMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

      const payload =
        await this._medicalSpecialityMedicalProcedureMappingService.getAllMedicalProceduresByMedicalSpeciality(
          query.medicalSpecialityId,
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

  public getMedicalProceduresByMedicalSpecialities = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;
      const payload =
        await this._medicalSpecialityMedicalProcedureMappingService.getAllMedicalProceduresByMedicalSpecialities(
          query.medicalSpecialityIds.split(",")
        );

      reply.status(200).send({ success: payload !== undefined, payload });
    } catch (error) {}
  };

  public postMedicalProcedure = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;

      const postMedicalProcedure =
        await this._medicalProcedureService.createMedicalProcedure({
          medicalProcedureName: body.medicalProcedureName,
          medicalProcedurePrice: parseInt(body.medicalProcedurePrice),
        });

      await this._medicalSpecialityMedicalProcedureMappingService.createMedicalSpecialityMedicalProcedureMapping(
        {
          medicalProcedureId: postMedicalProcedure?.medicalProcedureId!,
          medicalSpecialityId: body.medicalSpecialityId,
        }
      );

      if (postMedicalProcedure)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createMedicalProcedure",
            entity: "medicalProcedure",
            data: {
              medicalSpecialityId: body.medicalSpecialityId,
              medicalProcedure: postMedicalProcedure,
            },
          })
        );

      return reply
        .code(200)
        .send({ success: postMedicalProcedure !== undefined, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public putMedicalProcedure = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;

      const putMedicalProcedure =
        await this._medicalProcedureService.updateMedicalProcedure(
          body.medicalProcedureId,
          {
            medicalProcedureName: body.medicalProcedureName,
            medicalProcedurePrice: parseInt(body.medicalProcedurePrice),
          }
        );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "updateMedicalProcedure",
          data: putMedicalProcedure,
        })
      );

      return reply
        .code(200)
        .send({ success: putMedicalProcedure !== undefined, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };

  public deleteMedicalProcedure = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;

      await this._medicalSpecialityMedicalProcedureMappingService.deleteMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
        body.medicalSpecialityId,
        body.medicalProcedureId
      );

      const medicalProcedureToDelete =
        await this._medicalProcedureService.deleteMedicalProcedure(
          body.medicalProcedureId
        );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteMedicalProcedure",
          data: medicalProcedureToDelete,
        })
      );

      return reply
        .code(200)
        .send({ success: medicalProcedureToDelete !== undefined, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };
}
