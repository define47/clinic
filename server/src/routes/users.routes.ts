import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userController } from "../controllers";

export async function usersRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.retrieveAllUsersRelatedData(request, reply);
    }
  );
}
