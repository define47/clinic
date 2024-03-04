import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalSpecialityController } from "../controllers";

export async function medicalSpecialitiesRoutes(
  fastifyServer: FastifyInstance
) {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.getAllMedicalSpecialities(
        request,
        reply
      );
    }
  );
}
