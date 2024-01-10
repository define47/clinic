import {
  DoctorSpecialityMapping,
  DoctorSpecialityMappingCreationAttributes,
  doctorSpecialityMappingTable,
} from "../models/doctorSpecialityMapping.model";
import { DoctorSpecialityMappingRepository } from "../repositories/doctorSpecialityMapping.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IDoctorSpecialityMappingService } from "./doctorSpecialityMapping.iservice";

export class DoctorSpecialityMappingService
  implements IDoctorSpecialityMappingService
{
  private readonly _doctorSpecialityMappingRepository: DoctorSpecialityMappingRepository;

  public constructor() {
    this._doctorSpecialityMappingRepository =
      new DoctorSpecialityMappingRepository(
        drizzleInstance,
        doctorSpecialityMappingTable
      );
  }

  public async getDoctorSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorSpecialityMapping[] | undefined> {
    return await this._doctorSpecialityMappingRepository.getDoctorSpecialityMappingsByDoctorId(
      doctorId
    );
  }

  public async createDoctorSpecialityMapping(
    doctorSpecialityMappingCreationAttributes: DoctorSpecialityMappingCreationAttributes
  ): Promise<DoctorSpecialityMapping | undefined> {
    return await this._doctorSpecialityMappingRepository.createDoctorSpecialityMapping(
      doctorSpecialityMappingCreationAttributes
    );
  }

  public async updateDoctorSpecialityMapping(
    doctorId: string,
    currentSpecialityId: string,
    newSpecialityId: string,
    isPrimarySpeciality: boolean,
    isSecondarySpeciality: boolean,
    isTertiarySpeciality: boolean
  ): Promise<void> {
    return await this._doctorSpecialityMappingRepository.updateDoctorSpecialityMapping(
      doctorId,
      currentSpecialityId,
      newSpecialityId,
      isPrimarySpeciality,
      isSecondarySpeciality,
      isTertiarySpeciality
    );
  }

  public async deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    specialityId: string
  ): Promise<string> {
    return await this._doctorSpecialityMappingRepository.deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId(
      doctorId,
      specialityId
    );
  }

  public async deleteDoctorSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<void> {
    return await this._doctorSpecialityMappingRepository.deleteDoctorSpecialityMappingsByDoctorId(
      doctorId
    );
  }
}
