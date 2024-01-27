import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpecialityMedicalProcedureMapping,
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
  medicalSpecialityMedicalProcedureMappingTable,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import { BaseRepository } from "./base.repository";
import { IMedicalSpecialityMedicalProcedureMappingRepository } from "./medicalSpecialityMedicalProcedureMapping.irepository";
import { Table, eq } from "drizzle-orm";
import { medicalSpecialityTable } from "../models/medicalSpeciality.model";
import { medicalProcedureTable } from "../models/medicalProcedure.model";

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

  public async getAllMedicalSpecialitiesAndProcedures() {
    const data = await this._drizzle
      .select({
        medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
        medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
        procedureId: medicalProcedureTable.medicalProcedureId,
        procedureName: medicalProcedureTable.medicalProcedureName,
      })
      .from(this._table)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .innerJoin(
        medicalProcedureTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
          medicalProcedureTable.medicalProcedureId
        )
      );

    return data;
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
