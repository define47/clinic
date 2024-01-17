import {
  boolean,
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
  appointmentDateTime: Date;
  appointmentStatus: string;
  appointmentCancellationReason: string;
  appointmentCreatedAt: Date;
  appointmentUpdatedAt: Date;
};

export type AppointmentJoinDoctorAndPatient = {
  appointment: {
    appointmentId: string;
    appointmentDoctorId: string;
    appointmentPatientId: string;
    appointmentReason: string;
    appointmentDateTime: Date;
    appointmentStatus: string;
    appointmentCancellationReason: string | null;
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
    patientEmail: string;
  };
};

export type AppointmentCreationAttributes = {
  appointmentDoctorId: string;
  appointmentPatientId: string;
  appointmentReason: string;
  appointmentDateTime: Date;
  appointmentStatus: string;
};

export type AppointmentUpdateAttributes = {
  // appointmentDoctorId: string;
  // appointmentPatientId: string;
  // appointmentReason: string;
  appointmentDateTime: Date;
  appointmentStatus: string;
  appointmentCancellationReason: string;
  appointmentUpdatedAt: Date;
};

export const StatusEnum = pgEnum("appointmentStatus", [
  // pending approval => scheduled => confirmed by patient => completed (if patient makes appointment from their account)
  // scheduled => confirmed by patient => completed
  "scheduled",
  "rescheduled",
  "completed", // * by doctors to set
  "no-show",
  "pending approval", // * from reception or admin in the event that patient made appointment from their account
  "waiting", // * patient waiting
  "confirmed by patient",
  "canceled by patient",
  "paid",
]);

export const appointmentTable = clinicSchema.table("Appointment", {
  appointmentId: varchar("appointmentId").primaryKey(),
  appointmentDoctorId: varchar("appointmentDoctorId", { length: 100 })
    .notNull()
    .references(() => userTable.userId),
  appointmentPatientId: varchar("appointmentPatientId", { length: 100 })
    .notNull()
    .references(() => userTable.userId),
  appointmentDateTime: timestamp("appointmentDateTime").notNull(),
  appointmentReason: varchar("appointmentReason", { length: 256 }).notNull(),
  appointmentStatus: StatusEnum("appointmentStatus")
    .default("scheduled")
    .notNull(),
  appointmentCancellationReason: varchar("appointmentCancellationReason", {
    length: 256,
  }),
  appointmentCreatedAt: timestamp("appointmentCreatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  appointmentUpdatedAt: timestamp("appointmentUpdatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
