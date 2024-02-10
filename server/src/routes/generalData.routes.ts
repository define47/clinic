import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generalDataController } from "../controllers";

export const generalDataRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await generalDataController.getTotalCount(request, reply);
    }
  );
};
