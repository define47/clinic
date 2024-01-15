import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserPreferencesMapping,
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
} from "../models/userPreferencesMapping.model";
import { BaseRepository } from "./base.repository";
import { IUserPreferencesMappingRepository } from "./userPreferencesMapping.irepository";
import { Table } from "drizzle-orm";

export class UserPreferencesMappingRepository
  extends BaseRepository<UserPreferencesMapping>
  implements IUserPreferencesMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getUserPreferencesMappingByUserId(
    userId: string
  ): Promise<UserPreferencesMapping | undefined> {
    return await this.getById(userId);
  }

  public async createUserPreferencesMapping(
    userPreferencesMappingCreationAttributes: UserPreferencesMappingCreationAttributes
  ): Promise<UserPreferencesMapping | undefined> {
    return await this.create(userPreferencesMappingCreationAttributes);
  }

  public async updateUserPreferencesMapping(
    userId: string,
    userPreferencesMappingUpdateAttributes: UserPreferencesMappingUpdateAttributes
  ): Promise<UserPreferencesMapping | undefined> {
    return await this.update(userId, userPreferencesMappingUpdateAttributes);
  }
}
