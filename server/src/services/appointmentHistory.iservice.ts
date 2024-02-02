import {
  AppointmentHistory,
  AppointmentHistoryCreationAttributes,
  AppointmentHistoryInnerJoinPatientAndDoctorAndUser,
} from "../models/appointmentHistory.model";

export interface IAppointmentHistoryService {
  getAllAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistoryInnerJoinPatientAndDoctorAndUser[] | undefined>;

  createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined>;

  deleteAppointmentHistory(appointmentId: string): Promise<string | undefined>;
}
