import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";

export class MedicalSpecialityController {
  private readonly _medicalSpecialityService: MedicalSpecialityService;

  public constructor() {
    this._medicalSpecialityService = new MedicalSpecialityService();
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
          query.limit,
          query.page
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
      const body: any = request.body;

      let medicalSpecialityToCreate =
        await this._medicalSpecialityService.createMedicalSpeciality({
          medicalSpecialityName: body.medicalSpecialityName,
        });

      const { redis } = fastifyServer;

      if (medicalSpecialityToCreate)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createMedicalSpeciality",
            data: medicalSpecialityToCreate,
          })
        );

      return reply.code(200).send({
        success: medicalSpecialityToCreate !== undefined,
        message: "",
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
      const body: any = request.body;

      let medicalSpecialityToUpdate =
        await this._medicalSpecialityService.updateMedicalSpeciality(
          body.medicalSpecialityId,
          {
            medicalSpecialityName: body.medicalSpecialityName,
          }
        );

      const { redis } = fastifyServer;

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "updateMedicalSpeciality",
          data: medicalSpecialityToUpdate,
        })
      );

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };

  public deleteMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let medicalSpecialityToDelete =
        await this._medicalSpecialityService.deleteMedicalSpecialityById(
          body.medicalSpecialityId
        );

      const { redis } = fastifyServer;

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteMedicalSpeciality",
          data: medicalSpecialityToDelete,
        })
      );

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };
}
