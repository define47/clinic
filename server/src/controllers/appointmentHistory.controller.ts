import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentHistoryService } from "../services/appointmentHistory.service";

export class AppointmentHistoryController {
  private readonly _appointmentHistoryService: AppointmentHistoryService;

  public constructor() {
    this._appointmentHistoryService = new AppointmentHistoryService();
  }

  public getAppointmentHistoryByAppointmentId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const query: any = request.query;

    const payload =
      await this._appointmentHistoryService.getAppointmentHistoryByAppointmentId(
        query.appointmentId
      );

    reply.code(200).send({ success: true, payload });
  };
}
