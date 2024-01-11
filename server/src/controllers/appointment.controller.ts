import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment.service";
import { request } from "node:http";

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
          appointmentDoctorId: body.appointmentDoctorId,
          appointmentPatientId: body.appointmentPatientId,
          appointmentDateTime: new Date(body.appointmentDateTime),
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
      let appointmentToUpdate;

      appointmentToUpdate = await this._appointmentService.updateAppointment(
        body.appointmentId,
        {
          appointmentStatus: body.appointmentStatus,
          appointmentDateTime: new Date(body.appointmentDateTime),
          appointmentCancellationReason: body.appointmentCancellationReason,
        }
      );

      reply.code(200).send({ success: true, appointmentToUpdate });
    } catch (error) {}
  };

  public deleteAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const appointmentToDelete =
        await this._appointmentService.deleteAppointment(body.appointmentId);

      reply.code(200).send({ success: true, appointmentToDelete });
    } catch (error) {}
  };
}
