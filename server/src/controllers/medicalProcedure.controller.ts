import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalProcedureService } from "../services/medicalProcedure.service";
import { MedicalSpecialityMedicalProcedureMappingService } from "../services/medicalSpecialityMedicalProcedureMapping.service";

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

  public postMedicalProcedure = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      console.log(body);

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

      const putMedicalProcedure =
        await this._medicalProcedureService.updateMedicalProcedure(
          body.medicalProcedureId,
          {
            medicalProcedureName: body.medicalProcedureName,
            medicalProcedurePrice: parseInt(body.medicalProcedurePrice),
          }
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

      await this._medicalSpecialityMedicalProcedureMappingService.deleteMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
        body.medicalSpecialityId,
        body.medicalProcedureId
      );

      const deleteMedicalProcedure =
        await this._medicalProcedureService.deleteMedicalProcedure(
          body.medicalProcedureId
        );

      return reply
        .code(200)
        .send({ success: deleteMedicalProcedure !== undefined, message: "" });
    } catch (error) {
      console.log(error);
      return reply.code(400).send({ error: (error as Error).message });
    }
  };
}
