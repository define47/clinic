import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Patient,
  PatientCreationAttributes,
  PatientUpdateAttributes,
} from "../models/patient.model";
import { BaseRepository } from "./base.repository";
import { Table } from "drizzle-orm";

export class PatientRepository extends BaseRepository<Patient> {
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async createPatient(
    patientCreationAttributes: PatientCreationAttributes
  ) {
    return await this.create(patientCreationAttributes);
  }

  public async updatePatient(
    patientId: string,
    patientUpdateAttributes: PatientUpdateAttributes
  ) {
    return await this.update(patientId, patientUpdateAttributes);
  }
}
