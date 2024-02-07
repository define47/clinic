import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes,
  DoctorMedicalSpecialityMappingUpdateAttributes,
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

  public async getDoctorMedicalSpecialityMappingByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.getDoctorMedicalSpecialityMappingsByDoctorId(
      doctorId
    );
  }

  public async getDoctorMedicalSpecialityMappingsByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.getDoctorMedicalSpecialityMappingByMappingId(
      doctorMedicalSpecialityMappingId
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
    doctorMedicalSpecialityMappingId: string,
    doctorMedicalSpecialityMappingUpdateAttributes: DoctorMedicalSpecialityMappingUpdateAttributes
  ): Promise<DoctorMedicalSpecialityMapping | null> {
    return await this._doctorMedicalSpecialityMappingRepository.updateDoctorMedicalSpecialityMapping(
      doctorMedicalSpecialityMappingId,
      doctorMedicalSpecialityMappingUpdateAttributes
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

  public async deleteDoctorMedicalSpecialityMappingByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<string | undefined> {
    return await this._doctorMedicalSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingByMappingId(
      doctorMedicalSpecialityMappingId
    );
  }
}
