import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
import { DoctorMedicalSpecialityMappingRepository } from "../repositories/doctorMedicalSpecialityMapping.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IDoctorMedicalSpecialityMappingService } from "./doctorMedicalSpecialityMapping.iservice";

export class DoctorMedicalSpecialityMappingService
  implements IDoctorMedicalSpecialityMappingService
{
  private readonly _doctorMedicalSpecialityMappingRepository: DoctorMedicalSpecialityMappingRepository;

  public constructor() {
    this._doctorMedicalSpecialityMappingRepository =
      new DoctorMedicalSpecialityMappingRepository(
        drizzleInstance,
        doctorMedicalSpecialityMappingTable
      );
  }

  public async getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.getDoctorMedicalSpecialityMappingsByDoctorId(
      doctorId
    );
  }

  public async createMedicalDoctorSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.createDoctorMedicalSpecialityMapping(
      doctorMedicalSpecialityMappingCreationAttributes
    );
  }

  public async updateDoctorMedicalSpecialityMapping(
    doctorId: string,
    currentMedicalSpecialityId: string,
    newMedicalSpecialityId: string,
    isPrimaryMedicalSpeciality: boolean,
    isSecondaryMedicalSpeciality: boolean,
    isTertiaryMedicalSpeciality: boolean
  ): Promise<void> {
    return await this._doctorMedicalSpecialityMappingRepository.updateMedicalDoctorSpecialityMapping(
      doctorId,
      currentMedicalSpecialityId,
      newMedicalSpecialityId,
      isPrimaryMedicalSpeciality,
      isSecondaryMedicalSpeciality,
      isTertiaryMedicalSpeciality
    );
  }

  public async deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    medicalSpecialityId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(
      doctorId,
      medicalSpecialityId
    );
  }

  public async deleteDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<string | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingsByDoctorId(
      doctorId
    );
  }
}
