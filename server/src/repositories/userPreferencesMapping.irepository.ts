import {
  UserPreferencesMapping,
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
} from "../models/userPreferencesMapping.model";
import { IBaseRepository } from "./base.irepository";

export interface IUserPreferencesMappingRepository
  extends IBaseRepository<UserPreferencesMapping> {
  getUserPreferencesMappingByUserId(
    userId: string
  ): Promise<UserPreferencesMapping | undefined>;

  createUserPreferencesMapping(
    userPreferencesMappingCreationAttributes: UserPreferencesMappingCreationAttributes
  ): Promise<UserPreferencesMapping | undefined>;

  updateUserPreferencesMapping(
    userId: string,
    userPreferencesMappingUpdateAttributes: UserPreferencesMappingUpdateAttributes
  ): Promise<UserPreferencesMapping | undefined>;
}
