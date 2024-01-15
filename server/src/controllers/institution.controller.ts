import { FastifyReply, FastifyRequest } from "fastify";
import { InstitutionService } from "../services/institution.service";

export class InstitutionController {
  private readonly _institutionService: InstitutionService;

  public constructor() {
    this._institutionService = new InstitutionService();
  }

  public postInstitution = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      let institutionToCreate =
        await this._institutionService.createInstitution({
          institutionName: body.institutionName,
        });

      return reply
        .code(200)
        .send({ success: institutionToCreate !== undefined, message: "" });
    } catch (error) {
      console.log(error);
    }
  };
}
