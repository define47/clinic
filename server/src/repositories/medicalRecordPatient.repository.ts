import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
  medicalRecordPatientTable,
} from "../models/medicalRecordPatient.model";
import { BaseRepository } from "./base.repository";
import { IMedicalRecordPatientRepository } from "./medicalRecordPatient.irepository";
import { Table, and, eq } from "drizzle-orm";
import { userTable } from "../models/user.model";
import { alias } from "drizzle-orm/pg-core";
import { appointmentTable } from "../models/appointment.model";

export class MedicalRecordPatientRepository
  extends BaseRepository<MedicalRecordPatient>
  implements IMedicalRecordPatientRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getMedicalRecordPatientByAppointmentId(
    appointmentId: string
  ): Promise<MedicalRecordPatient | undefined> {
    return (
      await this._drizzle
        .select()
        .from(medicalRecordPatientTable)
        .where(eq(medicalRecordPatientTable.appointmentId, appointmentId))
    )[0];
  }

  // public async getMedicalRecordsByPatientId(
  //   patientId: string
  // ): Promise<any[] | undefined> {
  //   return await this._drizzle
  //     .select()
  //     .from(medicalRecordPatientTable)
  //     .innerJoin(userTable, eq(userTable.userId, patientId));
  // }

  public async getMedicalRecordsByPatientIdAndDoctorId(
    doctorId: string,
    patientId: string
  ): Promise<any[]> {
    const doctor = alias(userTable, "doctor");
    const patient = alias(userTable, "patient");
    return await this._drizzle
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
          appointmentPrice: appointmentTable.appointmentPrice,
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
        },

        medicalRecordPatient: {
          medicalRecordPatientId:
            medicalRecordPatientTable.medicalRecordPatientId,
          appointmentId: medicalRecordPatientTable.appointmentId,
          symptoms: medicalRecordPatientTable.symptoms,
          conductedTests: medicalRecordPatientTable.conductedTests,
          diagnosis: medicalRecordPatientTable.diagnosis,
          recommendations: medicalRecordPatientTable.recommendations,
        },
      })
      .from(medicalRecordPatientTable)
      .innerJoin(doctor, eq(doctor.userId, doctorId))
      .innerJoin(patient, eq(patient.userId, patientId))
      .innerJoin(
        appointmentTable,
        and(
          eq(
            appointmentTable.appointmentId,
            medicalRecordPatientTable.appointmentId
          ),
          eq(appointmentTable.appointmentDoctorId, doctorId),
          eq(appointmentTable.appointmentPatientId, patientId)
        )
      );
  }

  public async createMedicalRecordPatient(
    medicalRecordPatientCreationAttributes: MedicalRecordPatientCreationAttributes
  ): Promise<MedicalRecordPatient | undefined> {
    return await this.create(medicalRecordPatientCreationAttributes);
  }

  public async updateMedicalRecordPatient(
    appointmentId: string,
    medicalRecordPatientUpdateAttributes: MedicalRecordPatientUpdateAttributes
  ): Promise<MedicalRecordPatient | undefined> {
    return await this.update(
      appointmentId,
      medicalRecordPatientUpdateAttributes
    );
  }

  public async deleteMedicalRecordPatient(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this.delete(appointmentId);
  }
}
