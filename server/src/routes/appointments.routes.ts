import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentController } from "../controllers";

export const appointmentsRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query: any = request.query;
      if (query.message === "appointment")
        await appointmentController.getAppointmentById(request, reply);
      else if (query.message === "appointments")
        await appointmentController.getAllAppointments(request, reply);
      else if (query.message === "bookedDoctorAppointmentsSlots")
        await appointmentController.getDoctorAppointmentBookedSlots(
          request,
          reply
        );
      else if (query.message === "appointmentCountByPeriodAndStatus")
        await appointmentController.getAppointmentCountByPeriodAndStatus(
          request,
          reply
        );
    }
  );
};
