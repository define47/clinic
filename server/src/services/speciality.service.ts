import {
  Speciality,
  SpecialityCreationAttributes,
  specialityTable,
} from "../models/speciality.model";
import { SpecialityRepository } from "../repositories/speciality.repository";
import { drizzleInstance } from "../utils/drizzle";
import { ISpecialityService } from "./speciality.iservice";

export class SpecialityService implements ISpecialityService {
  private readonly _specialityRepository: SpecialityRepository;

  public constructor() {
    this._specialityRepository = new SpecialityRepository(
      drizzleInstance,
      specialityTable
    );
  }

  public async getSpecialityById(
    specialityId: string
  ): Promise<Speciality | undefined> {
    return await this._specialityRepository.getSpecialityById(specialityId);
  }

  public async getSpecialityByName(
    specialityName: string
  ): Promise<Speciality | undefined> {
    return await this._specialityRepository.getSpecialityByName(specialityName);
  }

  public async createSpeciality(
    specialityCreationAttributes: SpecialityCreationAttributes
  ): Promise<Speciality | undefined> {
    return await this._specialityRepository.createSpeciality(
      specialityCreationAttributes
    );
  }

  public async updateSpeciality(
    specialityId: string,
    specialityUpdateAttributes: SpecialityCreationAttributes
  ): Promise<Speciality | undefined> {
    return await this._specialityRepository.updateSpeciality(
      specialityId,
      specialityUpdateAttributes
    );
  }

  public async deleteSpecialityById(
    specialityId: string
  ): Promise<string | undefined> {
    return await this._specialityRepository.deleteSpecialityById(specialityId);
  }
}
