import { MedicalProcedure } from "../models/medicalProcedure.model";
import {
  MedicalSpecialityMedicalProcedureMapping,
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";

export interface IMedicalSpecialityMedicalProcedureMappingService {
  getMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping[] | undefined>;

  getAllMedicalProceduresByMedicalSpeciality(
    medicalSpecialityId: string,
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        tableData: MedicalProcedure[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  >;

  getMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined>;

  createMedicalSpecialityMedicalProcedureMapping(
    medicalSpecialityMedicalProcedureMappingCreationAttributes: MedicalSpecialityMedicalProcedureMappingCreationAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined>;

  updateMedicalSpecialityMedicalProcedureMapping(
    currentSpecialityId: string,
    newSPecialityId: string,
    medicalSpecialityMedicalProcedureMappingUpdateAttributes: MedicalSpecialityMedicalProcedureMappingUpdateAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined>;

  deleteMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<string | undefined>;

  deleteMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<string | undefined>;
}
