import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpecialityMedicalProcedureMapping,
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import { BaseRepository } from "./base.repository";
import { IMedicalSpecialityMedicalProcedureMappingRepository } from "./medicalSpecialityMedicalProcedureMapping.irepository";
import { Table } from "drizzle-orm";

export class MedicalSpecialityMedicalProcedureMappingRepository
  extends BaseRepository<MedicalSpecialityMedicalProcedureMapping>
  implements IMedicalSpecialityMedicalProcedureMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping[] | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    throw new Error("Method not implemented.");
  }

  public async createMedicalSpecialityMedicalProcedureMapping(
    medicalSpecialityMedicalProcedureMappingCreationAttributes: MedicalSpecialityMedicalProcedureMappingCreationAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    return await this.create(
      medicalSpecialityMedicalProcedureMappingCreationAttributes
    );
  }

  public async updateMedicalSpecialityMedicalProcedureMapping(
    currentSpecialityId: string,
    newSPecialityId: string,
    medicalSpecialityMedicalProcedureMappingUpdateAttributes: MedicalSpecialityMedicalProcedureMappingUpdateAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    throw new Error("Method not implemented.");
  }

  public async deleteMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }

  public async deleteMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }
}
