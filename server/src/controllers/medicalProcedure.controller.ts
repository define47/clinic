import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalProcedureService } from "../services/medicalProcedure.service";

export class MedicalProcedureController {
  private readonly _medicalProcedureService: MedicalProcedureService;

  public constructor() {
    this._medicalProcedureService = new MedicalProcedureService();
  }

  public postMedicalProcedure = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const postMedicalProcedure =
        await this._medicalProcedureService.createMedicalProcedure({
          medicalProcedureName: body.medicalProcedureName,
          medicalProcedurePrice: parseInt(body.medicalProcedurePrice),
        });

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
