import { FastifyReply, FastifyRequest } from "fastify";
import { SpecialityService } from "../services/speciality.service";

export class SpecialityController {
  private readonly _specialityService: SpecialityService;

  public constructor() {
    this._specialityService = new SpecialityService();
  }

  public postSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let specialityToCreate = await this._specialityService.createSpeciality({
        specialityName: body.specialityName,
      });

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };

  public putSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let specialityToUpdate = await this._specialityService.updateSpeciality(
        body.specialityId,
        { specialityName: body.specialityName }
      );

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };

  public deleteSpeciality = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let specialityToDelete =
        await this._specialityService.deleteSpecialityById(body.specialityId);

      return reply.code(200).send({ success: true, message: "" });
    } catch (error) {}
  };
}
