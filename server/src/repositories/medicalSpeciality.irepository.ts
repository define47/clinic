import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
} from "../models/medicalSpeciality.model";
import { IBaseRepository } from "./base.irepository";

export interface IMedicalSpecialityRepository
  extends IBaseRepository<MedicalSpeciality> {
  getMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<MedicalSpeciality | undefined>;

  getMedicalSpecialityByName(
    medicalSpecialityName: string
  ): Promise<MedicalSpeciality | undefined>;

  getAllMedicalSpecialities(
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        tableData: MedicalSpeciality[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  >;

  createMedicalSpeciality(
    medicalSpecialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined>;

  updateMedicalSpeciality(
    medicalSpecialityId: string,
    medicalSpecialityUpdateAttributes: MedicalSpecialityUpdateAttributes
  ): Promise<MedicalSpeciality | undefined>;

  deleteMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<string | undefined>;
}
