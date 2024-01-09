import {
  DoctorSpecialityMapping,
  DoctorSpecialityMappingCreationAttributes,
} from "../models/doctorSpecialityMapping.model";
import { IBaseRepository } from "./base.irepository";

export interface IDoctorSpecialityMappingRepository
  extends IBaseRepository<DoctorSpecialityMapping> {
  getDoctorSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorSpecialityMapping[] | undefined>;

  createDoctorSpecialityMapping(
    doctorSpecialityMappingCreationAttributes: DoctorSpecialityMappingCreationAttributes
  ): Promise<DoctorSpecialityMapping | undefined>;

  deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    specialityId: string
  ): Promise<string>;

  deleteDoctorSpecialityMappingsByDoctorId(doctorId: string): Promise<void>;
}
