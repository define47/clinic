import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment.service";
import { request } from "node:http";
import { AppointmentHistoryService } from "../services/appointmentHistory.service";

export class AppointmentController {
  private readonly _appointmentService: AppointmentService;
  private readonly _appointmentHistoryService: AppointmentHistoryService;

  public constructor() {
    this._appointmentService = new AppointmentService();
    this._appointmentHistoryService = new AppointmentHistoryService();
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

      if (appointmentToCreate)
        await this._appointmentHistoryService.createAppointmentHistory({
          appointmentId: appointmentToCreate?.appointmentId,
          appointmentHistoryDoctorId: appointmentToCreate.appointmentDoctorId,
          appointmentHistoryPatientId: appointmentToCreate.appointmentPatientId,
          appointmentHistoryDateTime: appointmentToCreate.appointmentDateTime,
          appointmentHistoryReason: appointmentToCreate.appointmentReason,
          appointmentHistoryCancellationReason: "",
          appointmentHistoryStatus: appointmentToCreate.appointmentStatus,
          appointmentHistoryCreatedAt: new Date(),
          appointmentHistoryUpdatedAt: new Date(),
          appointmentHistoryCreatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
          appointmentHistoryUpdatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
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
          appointmentUpdatedAt: new Date(),
        }
      );

      console.log(appointmentToUpdate);

      if (appointmentToUpdate) {
        const appointmentHistory =
          await this._appointmentHistoryService.getAppointmentHistoryByAppointmentId(
            appointmentToUpdate.appointmentId
          );
        // if (appointmentHistory) console.log(appointmentHistory[0]);

        await this._appointmentHistoryService.createAppointmentHistory({
          appointmentId: appointmentToUpdate?.appointmentId,
          appointmentHistoryDoctorId: appointmentToUpdate.appointmentDoctorId,
          appointmentHistoryPatientId: appointmentToUpdate.appointmentPatientId,
          appointmentHistoryDateTime: new Date(
            appointmentToUpdate.appointmentDateTime
          ),
          appointmentHistoryReason: appointmentToUpdate.appointmentReason,
          appointmentHistoryCancellationReason:
            appointmentToUpdate.appointmentCancellationReason,
          appointmentHistoryStatus: appointmentToUpdate.appointmentStatus,
          appointmentHistoryCreatedAt:
            appointmentHistory?.[0].appointmentHistoryCreatedAt!,
          appointmentHistoryUpdatedAt: new Date(),
          appointmentHistoryCreatedBy:
            appointmentHistory?.[0].appointmentHistoryCreatedBy!,
          appointmentHistoryUpdatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
        });
      }

      reply.code(200).send({ success: true, appointmentToUpdate });
    } catch (error) {}
  };

  public deleteAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      await this._appointmentHistoryService.deleteAppointmentHistory(
        body.appointmentId
      );

      const appointmentToDelete =
        await this._appointmentService.deleteAppointment(body.appointmentId);

      reply.code(200).send({ success: true, appointmentToDelete });
    } catch (error) {}
  };
}
