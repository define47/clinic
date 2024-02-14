import { boolean, primaryKey, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { notificationTable } from "./notification.model";

export type UserNotificationMapping = {
  receiverId: string;
  notificationId: string;
  isNotificationRead: boolean;
};

export type UserNotificationMappingCreationAttributes = {
  receiverId: string;
  notificationId: string;
  isNotificationRead: boolean;
};

export const userNotificationMappingTable = clinicSchema.table(
  "UserNotificationMapping",
  {
    // userId: varchar("userId")
    //   .notNull()
    //   .references(() => userTable.userId),
    receiverId: varchar("receiverId")
      .notNull()
      .references(() => userTable.userId),
    notificationId: varchar("notificationId")
      .notNull()
      .references(() => notificationTable.notificationId),
    isNotificationRead: boolean("isNotificationRead").default(false).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.receiverId, table.notificationId] }),
    };
  }
);
