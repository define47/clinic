import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
} from "../models/doctorMedicalSpecialityMapping.model";

export interface IDoctorMedicalSpecialityMappingService {
  getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined>;

  createMedicalDoctorSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  updateDoctorMedicalSpecialityMapping(
    doctorId: string,
    currentMedicalSpecialityId: string,
    newMedicalSpecialityId: string,
    isPrimaryMedicalSpeciality: boolean,
    isSecondaryMedicalSpeciality: boolean,
    isTertiaryMedicalSpeciality: boolean
  ): Promise<DoctorMedicalSpecialityMapping | null>;

  deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    medicalSpecialityId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  deleteDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<string | undefined>;
}
