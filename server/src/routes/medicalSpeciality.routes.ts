import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalSpecialityController } from "../controllers";

export async function medicalSpecialityRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.postMedicalSpeciality(request, reply);
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.deleteMedicalSpeciality(request, reply);
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.putMedicalSpeciality(request, reply);
    }
  );
}
