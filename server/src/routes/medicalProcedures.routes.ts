import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalProcedureController } from "../controllers";

export async function medicalProceduresRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.query.message === "medicalProceduresByMedicalSpeciality")
        await medicalProcedureController.getMedicalProceduresByMedicalSpeciality(
          request,
          reply
        );
      else if (
        request.query.message === "medicalProceduresByMedicalSpecialities"
      )
        await medicalProcedureController.getMedicalProceduresByMedicalSpecialities(
          request,
          reply
        );
    }
  );
}
