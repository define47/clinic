import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentController } from "../controllers";

export const appointmentDoctorBookedSlotsRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await appointmentController.getDoctorAppointmentBookedSlots(
        request,
        reply
      );
    }
  );
};
