import { boolean, primaryKey, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { notificationTable } from "./notification.model";

export type UserNotificationMapping = {
  userId: string;
  notificationId: string;
  isNotificationRead: boolean;
};

export type UserNotificationMappingCreationAttributes = {
  userId: string;
  notificationId: string;
  isNotificationRead: boolean;
};

export const userNotificationMappingTable = clinicSchema.table(
  "UserNotificationMapping",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => userTable.userId),
    notificationId: varchar("notificationId")
      .notNull()
      .references(() => notificationTable.notificationId),
    isNotificationRead: boolean("isNotificationRead").default(false).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.notificationId] }),
    };
  }
);
