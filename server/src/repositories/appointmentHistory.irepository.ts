import {
  AppointmentHistory,
  AppointmentHistoryCreationAttributes,
  AppointmentHistoryInnerJoinPatientAndDoctorAndUser,
} from "../models/appointmentHistory.model";
import { IBaseRepository } from "./base.irepository";

export interface IAppointmentHistoryRepository
  extends IBaseRepository<AppointmentHistory> {
  getAllAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistoryInnerJoinPatientAndDoctorAndUser[] | undefined>;

  createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined>;

  deleteAppointmentHistory(appointmentId: string): Promise<string | undefined>;
}
