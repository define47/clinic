// import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
// import { clinicSchema } from "../utils/drizzle";
// import { userTable } from "./user.model";
// import { sql } from "drizzle-orm";

// const ActionEnum = pgEnum("notificationAction", ["create", "update", "delete"]);
// const ModelEnum = pgEnum("notificationModel", [
//   "user",
//   "speciality",
//   "appointment",
//   "medical record",
//   "appointment reminder",
// ]);

// export const notificationTable = clinicSchema.table("Notification", {
//   notificationId: varchar("notificationId").primaryKey(),
//   notificationSender: varchar("notificationSender", { length: 100 })
//     .notNull()
//     .references(() => userTable.userId),
//   notificationAction: ActionEnum("notificationAction").notNull(),
//   notificationModel: ModelEnum("notificationModel").notNull(),
//   notificationDetails: varchar("notificationDetails", {
//     length: 256,
//   }).notNull(),
//   notificationDateTime: timestamp("notificationDateTime").default(
//     sql`CURRENT_TIMESTAMP`
//   ),
// });
