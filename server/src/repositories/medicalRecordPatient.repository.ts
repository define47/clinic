import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
  medicalRecordPatientTable,
} from "../models/medicalRecordPatient.model";
import { BaseRepository } from "./base.repository";
import { IMedicalRecordPatientRepository } from "./medicalRecordPatient.irepository";
import { Table, eq } from "drizzle-orm";
import { userTable } from "../models/user.model";

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
    return await this.getMedicalRecordPatientByAppointmentId(appointmentId);
  }

  public async getMedicalRecordsByPatientId(
    patientId: string
  ): Promise<any[] | undefined> {
    return await this._drizzle
      .select()
      .from(medicalRecordPatientTable)
      .innerJoin(userTable, eq(userTable.userId, patientId));
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
