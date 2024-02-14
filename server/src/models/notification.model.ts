import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { sql } from "drizzle-orm";

export type Notification = {
  notificationId: string;
  notificationSenderId: string;
  notificationAction: string;
  notificationEntity: string;
  notificationBody: string;
  notificationDateTime: Date;
};

export type NotificationCreationAttributes = {
  notificationSenderId: string;
  notificationAction: string;
  notificationEntity: string;
  notificationBody: string;
  notificationDateTime: Date;
};

export const notificationActionEnum = pgEnum("notificationAction", [
  "create",
  "update",
  "delete",
]);

export const notificationEntityEnum = pgEnum("notificationEntity", [
  "user",
  "speciality",
  "appointment",
  "medical record",
  "appointment reminder",
]);

export const notificationTable = clinicSchema.table("Notification", {
  notificationId: varchar("notificationId").primaryKey(),
  notificationSenderId: varchar("notificationSenderId", { length: 100 })
    .notNull()
    .references(() => userTable.userId),
  notificationAction: notificationActionEnum("notificationAction").notNull(),
  notificationEntity: notificationEntityEnum("notificationEntity").notNull(),
  notificationBody: varchar("notificationBody", {
    length: 99999,
  }).notNull(),
  notificationDateTime: timestamp("notificationDateTime").default(
    sql`CURRENT_TIMESTAMP`
  ),
});
