import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { notificationController } from "../controllers";

export const notificationRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await notificationController.getNotificationsByUser(request, reply);
    }
  );
};
