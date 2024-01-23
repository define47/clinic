import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalSpecialityController } from "../controllers";

export async function medicalSpecialityRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.getAllMedicalSpecialities(
        request,
        reply
      );
    }
  );

  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.postMedicalSpeciality(request, reply);
      //   reply.code(200);
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.deleteMedicalSpeciality(request, reply);
      //   reply.code(200);
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalSpecialityController.putMedicalSpeciality(request, reply);
      //   reply.code(200);
    }
  );
}
