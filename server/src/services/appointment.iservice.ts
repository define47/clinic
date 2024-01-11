import {
  Appointment,
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";

export interface IAppointmentService {
  createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined>;

  updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined>;

  deleteAppointment(appointmentId: string): Promise<string | undefined>;
}
