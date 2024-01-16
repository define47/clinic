import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalProcedure,
  MedicalProcedureCreationAttributes,
  MedicalProcedureUpdateAttributes,
} from "../models/medicalProcedure.model";
import { BaseRepository } from "./base.repository";
import { IMedicalProcedureRepository } from "./medicalProcedure.irepository";
import { Table } from "drizzle-orm";

export class MedicalProcedureRepository
  extends BaseRepository<MedicalProcedure>
  implements IMedicalProcedureRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getMedicalProcedureById(
    medicalProcedureId: string
  ): Promise<MedicalProcedure | undefined> {
    return await this.getById(medicalProcedureId);
  }

  public async getMedicalProcedureByName(
    medicalProcedureName: string
  ): Promise<MedicalProcedure | undefined> {
    return await this.getByAttribute(
      "medicalProcedureName",
      medicalProcedureName
    );
  }

  public async createMedicalProcedure(
    medicalProcedureCreationAttributes: MedicalProcedureCreationAttributes
  ): Promise<MedicalProcedure | undefined> {
    return await this.create(medicalProcedureCreationAttributes);
  }

  public async updateMedicalProcedure(
    medicalProcedureId: string,
    medicalProcedureUpdateAttributes: MedicalProcedureUpdateAttributes
  ): Promise<MedicalProcedure | undefined> {
    return await this.update(
      medicalProcedureId,
      medicalProcedureUpdateAttributes
    );
  }

  public async deleteMedicalProcedure(
    medicalProcedureId: string
  ): Promise<string | undefined> {
    return await this.delete(medicalProcedureId);
  }
}
