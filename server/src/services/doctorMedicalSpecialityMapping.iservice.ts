import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingUpdateAttributes,
} from "../models/doctorMedicalSpecialityMapping.model";

export interface IDoctorMedicalSpecialityMappingService {
  getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined>;

  createMedicalDoctorSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  updateDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingId: string,
    doctorMedicalSpecialityMappingUpdateAttributes: DoctorMedicalSpecialityMappingUpdateAttributes
  ): Promise<DoctorMedicalSpecialityMapping | null>;

  deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    medicalSpecialityId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  deleteDoctorMedicalSpecialityMappingByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<string | undefined>;
}
