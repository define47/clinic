import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Appointment,
  AppointmentCreationAttributes,
  AppointmentJoinDoctorAndPatient,
  AppointmentUpdateAttributes,
  appointmentTable,
} from "../models/appointment.model";
import { IAppointmentRepository } from "./appointment.irepository";
import { BaseRepository } from "./base.repository";
import { Table, eq, ilike } from "drizzle-orm";
import { userTable } from "../models/user.model";
import { alias } from "drizzle-orm/pg-core";

export class AppointmentRepository
  extends BaseRepository<Appointment>
  implements IAppointmentRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getAllAppointments(): Promise<
    AppointmentJoinDoctorAndPatient[] | undefined
  > {
    try {
      const doctor = alias(userTable, "doctor");
      const patient = alias(userTable, "patient");

      const data = await this._drizzle
        .select({
          appointment: {
            appointmentId: appointmentTable.appointmentId,
            appointmentDoctorId: appointmentTable.appointmentDoctorId,
            appointmentPatientId: appointmentTable.appointmentPatientId,
            appointmentReason: appointmentTable.appointmentReason,
            appointmentDateTime: appointmentTable.appointmentDateTime,
            appointmentStatus: appointmentTable.appointmentStatus,
            appointmentCancellationReason:
              appointmentTable.appointmentCancellationReason,
          },
          doctor: {
            doctorId: doctor.userId,
            doctorForename: doctor.userForename,
            doctorSurname: doctor.userSurname,
          },
          patient: {
            patientId: patient.userId,
            patientForename: patient.userForename,
            patientSurname: patient.userSurname,
            patientEmail: patient.userEmail,
          },
        })
        .from(appointmentTable)
        .innerJoin(
          doctor,
          eq(appointmentTable.appointmentDoctorId, doctor.userId)
        )
        .innerJoin(
          patient,
          eq(appointmentTable.appointmentPatientId, patient.userId)
        );

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  public async createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined> {
    return await this.create(appointmentCreationAttributes);
  }

  public async updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined> {
    return await this.update(appointmentId, appointmentUpdateAttributes);
  }

  public async deleteAppointment(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this.delete(appointmentId);
  }
}
