import {
  Institution,
  InstitutionCreationAttributes,
  InstitutionUpdateAttributes,
  institutionTable,
} from "../models/institution.model";
import { InstitutionRepository } from "../repositories/institution.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IInstitutionService } from "./institution.iservice";

export class InstitutionService implements IInstitutionService {
  private readonly _institutionRepository: InstitutionRepository;

  public constructor() {
    this._institutionRepository = new InstitutionRepository(
      drizzleInstance,
      institutionTable
    );
  }

  public async getInstitutionById(
    institutionId: string
  ): Promise<Institution | undefined> {
    return await this._institutionRepository.getInstitutionById(institutionId);
  }

  public async createInstitution(
    institutionCreationAttributes: InstitutionCreationAttributes
  ): Promise<Institution | undefined> {
    return await this._institutionRepository.createInstitution(
      institutionCreationAttributes
    );
  }

  public async updateInstitution(
    institutionId: string,
    institutionUpdateAttributes: InstitutionUpdateAttributes
  ): Promise<Institution | undefined> {
    return this._institutionRepository.updateInstitution(
      institutionId,
      institutionUpdateAttributes
    );
  }
}
