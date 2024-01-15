import {
  UserPreferencesMapping,
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
  userPreferencesMappingTable,
} from "../models/userPreferencesMapping.model";
import { UserPreferencesMappingRepository } from "../repositories/userPreferencesMapping.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IUserPreferencesMappingService } from "./userPreferencesMapping.iservice";

export class UserPreferencesMappingService
  implements IUserPreferencesMappingService
{
  private readonly _userPreferencesMappingRepository: UserPreferencesMappingRepository;

  public constructor() {
    this._userPreferencesMappingRepository =
      new UserPreferencesMappingRepository(
        drizzleInstance,
        userPreferencesMappingTable
      );
  }

  public async getUserPreferencesMappingByUserId(
    userId: string
  ): Promise<UserPreferencesMapping | undefined> {
    return await this._userPreferencesMappingRepository.getUserPreferencesMappingByUserId(
      userId
    );
  }

  public async createUserPreferencesMapping(
    userPreferencesMappingCreationAttributes: UserPreferencesMappingCreationAttributes
  ): Promise<UserPreferencesMapping | undefined> {
    return await this._userPreferencesMappingRepository.createUserPreferencesMapping(
      userPreferencesMappingCreationAttributes
    );
  }

  public async updateUserPreferencesMapping(
    userId: string,
    userPreferencesMappingUpdateAttributes: UserPreferencesMappingUpdateAttributes
  ): Promise<UserPreferencesMapping | undefined> {
    return await this._userPreferencesMappingRepository.updateUserPreferencesMapping(
      userId,
      userPreferencesMappingUpdateAttributes
    );
  }
}
