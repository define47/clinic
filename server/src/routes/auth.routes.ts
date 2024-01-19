import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userController } from "../controllers";

export async function authRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.loginUser(request, reply);
    }
  );

  fastifyServer.post(
    "/read-signed-cookie",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.verifyUser(request, reply);
    }
  );

  fastifyServer.post(
    "/logout",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.logoutUser(request, reply);
    }
  );
}
