import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { BaseRepository } from "./base.repository";
import { Table } from "drizzle-orm";
import { NotificationCreationAttributes } from "../models/notification.model";

export class NotificationRepository extends BaseRepository<Notification> {
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async createNotification(
    notificationCreationAttributes: NotificationCreationAttributes
  ) {
    return await this.create(notificationCreationAttributes);
  }
}
