import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userPreferencesController } from "../controllers";

export async function userPreferencesRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userPreferencesController.putUserPreferencesMapping(request, reply);
      //   reply.code(200);
    }
  );
}
