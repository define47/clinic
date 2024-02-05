import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingUpdateAttributes,
} from "../models/doctorMedicalSpecialityMapping.model";
import { IBaseRepository } from "./base.irepository";

export interface IDoctorSpecialityMappingRepository
  extends IBaseRepository<DoctorMedicalSpecialityMapping> {
  getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined>;

  createDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  updateDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingId: string,
    doctorMedicalSpecialityMappingUpdateAttributes: DoctorMedicalSpecialityMappingUpdateAttributes
  ): Promise<DoctorMedicalSpecialityMapping | null>;

  deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(
    doctorId: string,
    medicalSpecialityId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined>;

  deleteDoctorMedicalSpecialityMappingByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<string | undefined>;
}
