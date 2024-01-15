import {
  UserPreferencesMapping,
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
} from "../models/userPreferencesMapping.model";

export interface IUserPreferencesMappingService {
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
