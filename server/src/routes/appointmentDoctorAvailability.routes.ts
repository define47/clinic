import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentController } from "../controllers";

export const appointmentDoctorAvailabilityRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentController.getAppointmentDoctorAvailability(
        request,
        reply
      );
    }
  );
};
