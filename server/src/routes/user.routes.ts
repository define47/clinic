import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { userController } from "../controllers";

export async function userRoutes(fastifyServer: FastifyInstance) {
  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.postUser(request, reply);
      //   reply.code(200);
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.deleteUser(request, reply);
      //   reply.code(200);
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await userController.putUser(request, reply);
      //   reply.code(200);
    }
  );
}
