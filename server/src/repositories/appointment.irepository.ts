import {
  Appointment,
  AppointmentCreationAttributes,
} from "../models/appointment.model";
import { IBaseRepository } from "./base.irepository";

export interface IAppointmentRepository extends IBaseRepository<Appointment> {
  createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined>;
}
