import {
  Institution,
  InstitutionCreationAttributes,
  InstitutionUpdateAttributes,
} from "../models/institution.model";

export interface IInstitutionService {
  getInstitutionById(institutionId: string): Promise<Institution | undefined>;

  createInstitution(
    institutionCreationAttributes: InstitutionCreationAttributes
  ): Promise<Institution | undefined>;

  updateInstitution(
    institutionId: string,
    institutionUpdateAttributes: InstitutionUpdateAttributes
  ): Promise<Institution | undefined>;
}
