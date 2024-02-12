import {
  Appointment,
  AppointmentCreationAttributes,
  AppointmentJoinDoctorAndPatient,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";

export interface IAppointmentService {
  getAllAppointments(
    searchInTable: string,
    orderInTable: string,
    searchBy: string[],
    searchQuery: string,
    scheduleFilter: string,
    customStartDate: string,
    customEndDate: string,
    orderBy: string,
    limit: number,
    page: number,
    doctorId?: string,
    patientId?: string
  ): Promise<
    | {
        tableData: AppointmentJoinDoctorAndPatient[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  >;

  createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined>;

  updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined>;

  deleteAppointment(appointmentId: string): Promise<string | undefined>;
}
