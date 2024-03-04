import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentController } from "../controllers";

export const appointmentRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentController.postAppointment(request, reply);
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentController.updateAppointment(request, reply);
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentController.deleteAppointment(request, reply);
    }
  );
};
