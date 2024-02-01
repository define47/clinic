import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentHistoryController } from "../controllers";

export const appointmentHistoryRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentHistoryController.getAppointmentHistoryByAppointmentId(
        request,
        reply
      );
    }
  );
};
