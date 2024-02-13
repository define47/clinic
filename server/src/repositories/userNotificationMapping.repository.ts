import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserNotificationMapping,
  UserNotificationMappingCreationAttributes,
  userNotificationMappingTable,
} from "../models/userNotificationMapping.model";
import { BaseRepository } from "./base.repository";
import { Table, and, eq, gte, lte } from "drizzle-orm";
import { notificationTable } from "../models/notification.model";
import { userTable } from "../models/user.model";

export class UserNotificationMappingRepository extends BaseRepository<UserNotificationMapping> {
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getNotificationsByUser(userId: string) {
    const currentDate = new Date();

    var dNow = new Date();
    var s =
      dNow.getMonth() +
      1 +
      "/" +
      dNow.getDate() +
      "/" +
      dNow.getFullYear() +
      " " +
      dNow.getHours() +
      ":" +
      dNow.getMinutes();

    const currentDayStartInUTC = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      )
    );
    const currentDayEndInUTC = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59,
        999
      )
    );

    console.log(currentDate.toLocaleTimeString());

    console.log(currentDayStartInUTC);

    console.log(currentDayEndInUTC);

    console.log(s);

    return await this._drizzle
      .select()
      .from(userNotificationMappingTable)
      .innerJoin(
        notificationTable,
        eq(
          userNotificationMappingTable.notificationId,
          notificationTable.notificationId
        )
      )
      .innerJoin(
        userTable,
        eq(userNotificationMappingTable.userId, userTable.userId)
      )
      .where(
        and(
          eq(userNotificationMappingTable.userId, userId),
          gte(notificationTable.notificationDateTime, currentDayStartInUTC),
          lte(notificationTable.notificationDateTime, currentDayEndInUTC)
        )
      );
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
