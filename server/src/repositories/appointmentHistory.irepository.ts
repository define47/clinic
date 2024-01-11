import {
  AppointmentHistory,
  AppointmentHistoryCreationAttributes,
} from "../models/appointmentHistory.model";
import { IBaseRepository } from "./base.irepository";

export interface IAppointmentHistoryRepository
  extends IBaseRepository<AppointmentHistory> {
  getAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistory[] | undefined>;

  createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined>;

  deleteAppointmentHistory(appointmentId: string): Promise<string | undefined>;
}
