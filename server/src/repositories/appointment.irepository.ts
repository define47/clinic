import {
  Appointment,
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";
import { IBaseRepository } from "./base.irepository";

export interface IAppointmentRepository extends IBaseRepository<Appointment> {
  createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined>;

  updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined>;

  deleteAppointment(appointmentId: string): Promise<string | undefined>;
}
