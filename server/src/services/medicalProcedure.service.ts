import {
  MedicalProcedure,
  MedicalProcedureCreationAttributes,
  MedicalProcedureUpdateAttributes,
  medicalProcedureTable,
} from "../models/medicalProcedure.model";
import { MedicalProcedureRepository } from "../repositories/medicalProcedure.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IMedicalProcedureService } from "./medicalProcedure.iservice";

export class MedicalProcedureService implements IMedicalProcedureService {
  private readonly _medicalProcedureRepository: MedicalProcedureRepository;

  public constructor() {
    this._medicalProcedureRepository = new MedicalProcedureRepository(
      drizzleInstance,
      medicalProcedureTable
    );
  }

  public async getMedicalProcedureById(
    medicalProcedureId: string
  ): Promise<MedicalProcedure | undefined> {
    return await this._medicalProcedureRepository.getMedicalProcedureById(
      medicalProcedureId
    );
  }

  public async getMedicalProcedureByName(
    medicalProcedureName: string
  ): Promise<MedicalProcedure | undefined> {
    return await this.getMedicalProcedureByName(medicalProcedureName);
  }

  public async createMedicalProcedure(
    medicalProcedureCreationAttributes: MedicalProcedureCreationAttributes
  ): Promise<MedicalProcedure | undefined> {
    return await this.createMedicalProcedure(
      medicalProcedureCreationAttributes
    );
  }

  public async updateMedicalProcedure(
    medicalProcedureId: string,
    medicalProcedureUpdateAttributes: MedicalProcedureUpdateAttributes
  ): Promise<MedicalProcedure | undefined> {
    return await this._medicalProcedureRepository.updateMedicalProcedure(
      medicalProcedureId,
      medicalProcedureUpdateAttributes
    );
  }

  public async deleteMedicalProcedure(
    medicalProcedureId: string
  ): Promise<string | undefined> {
    return await this._medicalProcedureRepository.deleteMedicalProcedure(
      medicalProcedureId
    );
  }
}
