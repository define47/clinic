import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
} from "../models/medicalSpeciality.model";

export interface IMedicalSpecialityService {
  getMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<MedicalSpeciality | undefined>;

  getMedicalSpecialityByName(
    medicalSpecialityName: string
  ): Promise<MedicalSpeciality | undefined>;

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
