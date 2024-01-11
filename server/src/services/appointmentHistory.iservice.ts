import {
  AppointmentHistory,
  AppointmentHistoryCreationAttributes,
} from "../models/appointmentHistory.model";

export interface IAppointmentHistoryService {
  getAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistory[] | undefined>;

  createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined>;

  deleteAppointmentHistory(appointmentId: string): Promise<string | undefined>;
}
