import { MedicalProcedure } from "../models/medicalProcedure.model";
import {
  MedicalSpecialityMedicalProcedureMapping,
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
  medicalSpecialityMedicalProcedureMappingTable,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import { MedicalSpecialityMedicalProcedureMappingRepository } from "../repositories/medicalSpecialityMedicalProcedureMapping.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IMedicalSpecialityMedicalProcedureMappingService } from "./medicalSpecialityMedicalProcedureMapping.iservice";

export class MedicalSpecialityMedicalProcedureMappingService
  implements IMedicalSpecialityMedicalProcedureMappingService
{
  private readonly _medicalSpecialityMedicalProcedureRepository =
    new MedicalSpecialityMedicalProcedureMappingRepository(
      drizzleInstance,
      medicalSpecialityMedicalProcedureMappingTable
    );

  public async getMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping[] | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getAllMedicalProceduresByMedicalSpeciality(
    medicalSpecialityId: string,
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | { tableData: MedicalProcedure[]; totalCount: number; totalPages: number }
    | undefined
  > {
    return this._medicalSpecialityMedicalProcedureRepository.getAllMedicalProceduresByMedicalSpeciality(
      medicalSpecialityId,
      searchQuery,
      limit,
      page,
      orderBy
    );
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
    return this._medicalSpecialityMedicalProcedureRepository.createMedicalSpecialityMedicalProcedureMapping(
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
