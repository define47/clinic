import {
  MedicalProcedure,
  MedicalProcedureCreationAttributes,
  MedicalProcedureUpdateAttributes,
} from "../models/medicalProcedure.model";
import { IBaseRepository } from "./base.irepository";

export interface IMedicalProcedureRepository
  extends IBaseRepository<MedicalProcedure> {
  getMedicalProcedureById(
    medicalProcedureId: string
  ): Promise<MedicalProcedure | undefined>;

  getMedicalProcedureByName(
    medicalProcedureName: string
  ): Promise<MedicalProcedure | undefined>;

  createMedicalProcedure(
    medicalProcedureCreationAttributes: MedicalProcedureCreationAttributes
  ): Promise<MedicalProcedure | undefined>;

  updateMedicalProcedure(
    medicalProcedureId: string,
    medicalProcedureUpdateAttributes: MedicalProcedureUpdateAttributes
  ): Promise<MedicalProcedure | undefined>;

  deleteMedicalProcedure(
    medicalProcedureId: string
  ): Promise<string | undefined>;
}
