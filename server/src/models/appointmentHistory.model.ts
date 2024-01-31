import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";
import { userTable } from "./user.model";
import { appointmentTable } from "./appointment.model";

export type AppointmentHistory = {
  appointmentHistoryId: string;
  appointmentId: string;
  appointmentHistoryDoctorId: string;
  appointmentHistoryPatientId: string;
  appointmentHistoryDateTime: Date;
  appointmentHistoryStatus: string;
  appointmentHistoryReason: string;
  appointmentHistoryCancellationReason: string | null;
  appointmentHistoryCreatedAt: Date | null;
  appointmentHistoryUpdatedAt: Date | null;
  appointmentHistoryCreatedBy: string | null;
  appointmentHistoryUpdatedBy: string | null;
};

export type AppointmentHistoryCreationAttributes = {
  appointmentId: string;
  appointmentHistoryDoctorId: string;
  appointmentHistoryPatientId: string;
  appointmentHistoryDateTime: Date;
  appointmentHistoryStatus: string;
  appointmentHistoryReason: string;
  appointmentHistoryCancellationReason: string;
  appointmentHistoryCreatedAt?: Date;
  appointmentHistoryUpdatedAt: Date;
  appointmentHistoryCreatedBy?: string;
  appointmentHistoryUpdatedBy: string;
};

export const AppointmentHistoryStatusEnum = pgEnum("appointmentHistoryStatus", [
  // pending approval => scheduled => confirmed by patient => completed (if patient makes appointment from their account)
  // scheduled => confirmed by patient => completed
  "scheduled",
  "rescheduled",
  "completed",
  "no-show",
  "pending approval",
  "waiting",
  "confirmed by patient",
  "canceled by patient",
  "paid",
]);

export const appointmentHistoryTable = clinicSchema.table(
  "AppointmentHistory",
  {
    appointmentHistoryId: varchar("appointmentHistoryId").primaryKey(),
    appointmentId: varchar("appointmentId", { length: 100 })
      .notNull()
      .references(() => appointmentTable.appointmentId),
    appointmentHistoryDoctorId: varchar("appointmentHistoryDoctorId", {
      length: 100,
    })
      .notNull()
      .references(() => userTable.userId),
    appointmentHistoryPatientId: varchar("appointmentHistoryPatientId", {
      length: 100,
    })
      .notNull()
      .references(() => userTable.userId),
    appointmentHistoryDateTime: timestamp(
      "appointmentHistoryDateTime"
    ).notNull(),
    appointmentHistoryReason: varchar("appointmentHistoryReason", {
      length: 256,
    }).notNull(),
    appointmentHistoryStatus: AppointmentHistoryStatusEnum(
      "appointmentHistoryStatus"
    )
      .default("scheduled")
      .notNull(),
    appointmentHistoryCancellationReason: varchar(
      "appointmentHistoryCancellationReason",
      {
        length: 256,
      }
    ),
    appointmentHistoryCreatedBy: varchar("appointmentHistoryCreatedBy", {
      length: 100,
    }).references(() => userTable.userId),
    appointmentHistoryUpdatedBy: varchar("appointmentHistoryUpdatedBy", {
      length: 100,
    }).references(() => userTable.userId),
    appointmentHistoryCreatedAt: timestamp(
      "appointmentHistoryCreatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
    appointmentHistoryUpdatedAt: timestamp(
      "appointmentHistoryUpdatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
  }
);
