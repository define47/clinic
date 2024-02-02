import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  AppointmentHistoryCreationAttributes,
  AppointmentHistory,
  appointmentHistoryTable,
  AppointmentHistoryInnerJoinPatientAndDoctorAndUser,
} from "../models/appointmentHistory.model";
import { IAppointmentHistoryRepository } from "./appointmentHistory.irepository";
import { BaseRepository } from "./base.repository";
import { Table, asc, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { userTable } from "../models/user.model";

export class AppointmentHistoryRepository
  extends BaseRepository<AppointmentHistory>
  implements IAppointmentHistoryRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistory[] | undefined> {
    return await this._drizzle
      .select()
      .from(appointmentHistoryTable)
      .where(eq(appointmentHistoryTable.appointmentId, appointmentId));
  }

  public async getAllAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistoryInnerJoinPatientAndDoctorAndUser[] | undefined> {
    const doctor = alias(userTable, "doctor");
    const patient = alias(userTable, "patient");
    const creator = alias(userTable, "creator");
    const modifier = alias(userTable, "modifier");

    const data = await this._drizzle
      .select({
        appointmentHistory: {
          appointmentHistoryId: appointmentHistoryTable.appointmentHistoryId,
          appointmentId: appointmentHistoryTable.appointmentId,
          appointmentHistoryDoctorId:
            appointmentHistoryTable.appointmentHistoryDoctorId,
          appointmentHistoryPatientId:
            appointmentHistoryTable.appointmentHistoryPatientId,
          appointmentHistoryReason:
            appointmentHistoryTable.appointmentHistoryReason,
          appointmentHistoryDateTime:
            appointmentHistoryTable.appointmentHistoryDateTime,
          appointmentHistoryStatus:
            appointmentHistoryTable.appointmentHistoryStatus,
          appointmentHistoryCancellationReason:
            appointmentHistoryTable.appointmentHistoryCancellationReason,
        },
        creator: {
          appointmentHistoryCreatedBy:
            appointmentHistoryTable.appointmentHistoryCreatedBy,
          appointmentHistoryCreatedByForename: creator.userForename,
          appointmentHistoryCreatedBySurname: creator.userSurname,
          appointmentHistoryCreatedAt:
            appointmentHistoryTable.appointmentHistoryCreatedAt,
        },
        modifier: {
          appointmentHistoryUpdatedBy:
            appointmentHistoryTable.appointmentHistoryUpdatedBy,
          appointmentHistoryUpdatedByForename: modifier.userForename,
          appointmentHistoryUpdatedBySurname: modifier.userSurname,
          appointmentHistoryUpdatedAt:
            appointmentHistoryTable.appointmentHistoryUpdatedAt,
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
      .from(appointmentHistoryTable)
      .innerJoin(
        creator,
        eq(appointmentHistoryTable.appointmentHistoryCreatedBy, creator.userId)
      )
      .innerJoin(
        modifier,
        eq(appointmentHistoryTable.appointmentHistoryUpdatedBy, modifier.userId)
      )
      .innerJoin(
        doctor,
        eq(appointmentHistoryTable.appointmentHistoryDoctorId, doctor.userId)
      )
      .innerJoin(
        patient,
        eq(appointmentHistoryTable.appointmentHistoryPatientId, patient.userId)
      )
      .where(eq(appointmentHistoryTable.appointmentId, appointmentId))
      .orderBy(asc(appointmentHistoryTable.appointmentHistoryUpdatedAt));

    return data;

    // return await this._drizzle
    //   .select()
    //   .from(appointmentHistoryTable)
    //   .innerJoin(
    //     user,
    //     eq(appointmentHistoryTable.appointmentHistoryCreatedBy, user.userId)
    //   )
    //   .innerJoin(
    //     doctor,
    //     eq(appointmentHistoryTable.appointmentHistoryDoctorId, doctor.userId)
    //   )
    //   .innerJoin(
    //     patient,
    //     eq(appointmentHistoryTable.appointmentHistoryPatientId, patient.userId)
    //   )
    //   .where(eq(appointmentHistoryTable.appointmentId, appointmentId));
  }

  public async createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined> {
    return await this.create(appointmentHistoryCreationAttributes);
  }

  public async deleteAppointmentHistory(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this.delete(appointmentId);
  }
}
