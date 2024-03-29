import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";
import { MedicalSpecialityRepository } from "../repositories/medicalSpeciality.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IMedicalSpecialityService } from "./medicalSpeciality.iservice";

export class MedicalSpecialityService implements IMedicalSpecialityService {
  private readonly _medicalSpecialityRepository: MedicalSpecialityRepository;

  public constructor() {
    this._medicalSpecialityRepository = new MedicalSpecialityRepository(
      drizzleInstance,
      medicalSpecialityTable
    );
  }

  public async getMedicalSpecialityCount(): Promise<number | undefined> {
    return this._medicalSpecialityRepository.getMedicalSpecialityCount();
  }

  public async getMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this._medicalSpecialityRepository.getMedicalSpecialityById(
      medicalSpecialityId
    );
  }

  public async getMedicalSpecialityByName(
    medicalSpecialityName: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this._medicalSpecialityRepository.getMedicalSpecialityByName(
      medicalSpecialityName
    );
  }

  public async getAllMedicalSpecialities(
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | { tableData: MedicalSpeciality[]; totalCount: number; totalPages: number }
    | undefined
  > {
    return await this._medicalSpecialityRepository.getAllMedicalSpecialities(
      searchQuery,
      limit,
      page,
      orderBy
    );
  }

  public async createMedicalSpeciality(
    medicalSpecialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this._medicalSpecialityRepository.createMedicalSpeciality(
      medicalSpecialityCreationAttributes
    );
  }

  public async updateMedicalSpeciality(
    specialityId: string,
    medicalSpecialityUpdateAttributes: MedicalSpecialityUpdateAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this._medicalSpecialityRepository.updateMedicalSpeciality(
      specialityId,
      medicalSpecialityUpdateAttributes
    );
  }

  public async deleteMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<string | undefined> {
    return await this._medicalSpecialityRepository.deleteMedicalSpecialityById(
      medicalSpecialityId
    );
  }
}
