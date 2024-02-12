import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserNotificationMapping,
  UserNotificationMappingCreationAttributes,
  userNotificationMappingTable,
} from "../models/userNotificationMapping.model";
import { BaseRepository } from "./base.repository";
import { Table, and, eq } from "drizzle-orm";

export class UserNotificationMappingRepository extends BaseRepository<UserNotificationMapping> {
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async createUserNotificationMapping(
    userNotificationMappingCreationAttributes: UserNotificationMappingCreationAttributes
  ) {
    return await this.create(userNotificationMappingCreationAttributes);
  }

  public async markNotificationAsRead(userId: string, notificationId: string) {
    return await this._drizzle
      .update(userNotificationMappingTable)
      .set({ isNotificationRead: true })
      .where(
        and(
          eq(userNotificationMappingTable.userId, userId),
          eq(userNotificationMappingTable.notificationId, notificationId)
        )
      )
      .returning({
        userId: userNotificationMappingTable.userId,
        notificationId: userNotificationMappingTable.notificationId,
      });
  }
}
