import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment.service";

export class AppointmentController {
  private readonly _appointmentService: AppointmentService;

  public constructor() {
    this._appointmentService = new AppointmentService();
  }

  public postAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const appointmentToCreate =
        await this._appointmentService.createAppointment({
          appointmentDoctorId: body.doctorId,
          appointmentPatientId: body.patientId,
          appointmentDateTime: body.appointmentDateTime,
          appointmentReason: body.appointmentReason,
          appointmentStatus: body.appointmentStatus,
        });

      reply.code(200).send({ success: true, appointmentToCreate });
    } catch (error) {}
  };

  public updateAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const appointmentToUpdate =
        await this._appointmentService.updateAppointment(body.appointmentId, {
          appointmentStatus: body.appointmentStatus,
          appointmentCancellationReason: body.appointmentCancellationReason,
        });

      reply.code(200).send({ success: true, appointmentToUpdate });
    } catch (error) {}
  };
}
