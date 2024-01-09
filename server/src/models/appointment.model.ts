import {
  date,
  pgEnum,
  pgSchema,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";
import { userTable } from "./user.model";

export type Appointment = {
  appointmentId: string;
  appointmentDoctorId: string;
  appointmentPatientId: string;
  appointmentReason: string;
  appointmentDateTime: string;
  appointmentStatus: string;
};

export type AppointmentCreationAttributes = {
  appointmentDoctorId: string;
  appointmentPatientId: string;
  appointmentReason: string;
  appointmentDateTime: string;
  appointmentStatus: string;
};

export type AppointmentUpdateAttributes = AppointmentCreationAttributes;

export const StatusEnum = pgEnum("appointmentStatus", [
  "rescheduled",
  "scheduled",
  "completed",
  "no-show",
  "canceled",
]);

export const appointmentTable = clinicSchema.table("Appointment", {
  appointmentId: varchar("appointmentId").primaryKey(),
  appointmentDoctorId: varchar("appointmentDoctorId", { length: 100 })
    .notNull()
    .references(() => userTable.userId),
  appointmentPatientId: varchar("appointmentPatientId", { length: 100 })
    .notNull()
    .references(() => userTable.userId),
  appointmentReason: varchar("appointmentReason", { length: 256 }).notNull(),
  appointmentCancellationReason: varchar("appointmentCancellationReason", {
    length: 256,
  }).notNull(),
  appointmentDateTime: timestamp("appointmentDateTime"),
  appointmentStatus: StatusEnum("appointmentStatus").notNull(),

  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
