import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";

export class MedicalSpecialityController {
  private readonly _medicalSpecialityService: MedicalSpecialityService;

  public constructor() {
    this._medicalSpecialityService = new MedicalSpecialityService();
  }

  public postMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let medicalSpecialityToCreate =
        await this._medicalSpecialityService.createMedicalSpeciality({
          medicalSpecialityName: body.specialityName,
        });

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };

  public putMedicalSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let medicalSpecialityToUpdate =
        await this._medicalSpecialityService.updateMedicalSpeciality(
          body.specialityId,
          {
            medicalSpecialityName: body.medicalSpecialityName,
          }
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
          body.specialityId
        );

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };
}
