import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalProcedureController } from "../controllers";

export async function medicalProcedureRoutes(fastifyServer: FastifyInstance) {
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

  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalProcedureController.postMedicalProcedure(request, reply);
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalProcedureController.putMedicalProcedure(request, reply);
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalProcedureController.deleteMedicalProcedure(request, reply);
    }
  );
}
