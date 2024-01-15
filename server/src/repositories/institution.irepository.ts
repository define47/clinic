import {
  Institution,
  InstitutionCreationAttributes,
  InstitutionUpdateAttributes,
} from "../models/institution.model";
import { IBaseRepository } from "./base.irepository";

export interface IInstitutionRepository extends IBaseRepository<Institution> {
  getInstitutionById(institutionId: string): Promise<Institution | undefined>;

  createInstitution(
    institutionCreationAttributes: InstitutionCreationAttributes
  ): Promise<Institution | undefined>;

  updateInstitution(
    institutionId: string,
    institutionUpdateAttributes: InstitutionUpdateAttributes
  ): Promise<Institution | undefined>;
}
