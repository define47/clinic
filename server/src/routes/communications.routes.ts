import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { communicationsController } from "../controllers";

export const communicationsRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.post(
    "/email",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await communicationsController.sendEmail(request, reply);
    }
  );
};
