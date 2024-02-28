import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { appointmentController } from "../controllers";

export const appointmentRoutes: (
  fastifyServer: FastifyInstance
) => Promise<void> = async (fastifyServer) => {
  // fastifyServer.get(
  //   "/",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     await appointmentController.getAppointment(request, reply);
  //   }
  // );

  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // if (request.query.appointmentId)
      //   await appointmentController.getAppointmentById(request, reply);
      // else await appointmentController.getAllAppointments(request, reply);
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
