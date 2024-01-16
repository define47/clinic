import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
} from "../models/medicalSpeciality.model";

export interface ISpecialityService {
  getSpecialityById(
    specialityId: string
  ): Promise<MedicalSpeciality | undefined>;

  getSpecialityByName(
    specialityName: string
  ): Promise<MedicalSpeciality | undefined>;

  createSpeciality(
    specialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined>;

  updateSpeciality(
    specialityId: string,
    specialityUpdateAttributes: MedicalSpecialityUpdateAttributes
  ): Promise<MedicalSpeciality | undefined>;

  deleteSpecialityById(specialityId: string): Promise<string | undefined>;
}
