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
  appointmentHistoryCreatedAt: Date;
  appointmentHistoryUpdatedAt: Date;
  appointmentHistoryCreatedBy: string;
  appointmentHistoryUpdatedBy: string;
};

export type AppointmentHistoryInnerJoinPatientAndDoctorAndUser = {
  appointmentHistory: {
    appointmentHistoryId: string;
    appointmentId: string;
    appointmentHistoryDoctorId: string;
    appointmentHistoryPatientId: string;
    appointmentHistoryReason: string;
    appointmentHistoryDateTime: Date;
    appointmentHistoryStatus: string;
    appointmentHistoryCancellationReason: string | null;
  };
  creator: {
    appointmentHistoryCreatedBy: string;
    appointmentHistoryCreatedByForename: string;
    appointmentHistoryCreatedBySurname: string;
    appointmentHistoryCreatedAt: Date;
  };
  modifier: {
    appointmentHistoryUpdatedBy: string;
    appointmentHistoryUpdatedByForename: string;
    appointmentHistoryUpdatedBySurname: string;
    appointmentHistoryUpdatedAt: Date;
  };
  doctor: {
    doctorId: string;
    doctorForename: string;
    doctorSurname: string;
  };
  patient: {
    patientId: string;
    patientForename: string;
    patientSurname: string;
  };
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
    // appointmentHistoryStatus: varchar("appointmentHistoryStatus"),
    appointmentHistoryCancellationReason: varchar(
      "appointmentHistoryCancellationReason",
      {
        length: 256,
      }
    ),
    appointmentHistoryCreatedBy: varchar("appointmentHistoryCreatedBy", {
      length: 100,
    })
      .notNull()
      .references(() => userTable.userId),
    appointmentHistoryUpdatedBy: varchar("appointmentHistoryUpdatedBy", {
      length: 100,
    })
      .notNull()
      .references(() => userTable.userId),
    appointmentHistoryCreatedAt: timestamp("appointmentHistoryCreatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    appointmentHistoryUpdatedAt: timestamp("appointmentHistoryUpdatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
);
