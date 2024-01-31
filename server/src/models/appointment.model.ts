import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";

export type Appointment = {
  appointmentId: string;
  appointmentDoctorId: string;
  appointmentPatientId: string;
  appointmentReason: string;
  appointmentDateTime: Date;
  appointmentStatus: string;
  appointmentCancellationReason: string;
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
  appointmentReason: string;
  appointmentDateTime: Date;
  appointmentStatus: string;
  appointmentCancellationReason: string;
};

// "scheduled",
//   "rescheduled",
//   "completed", // * by doctors to set
//   "no-show",
//   "pending approval", // * from reception or admin in the event that patient made appointment from their account
//   "waiting", // * patient waiting
//   "confirmed by patient",
//   "canceled by patient",
//   "paid",

// pending approval => scheduled => confirmed by patient => completed (if patient makes appointment from their account)
// scheduled => confirmed by patient => completed

export const AppointmentStatusEnum = pgEnum("appointmentStatus", [
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
  appointmentStatus: AppointmentStatusEnum("appointmentStatus").notNull(),
  appointmentCancellationReason: varchar("appointmentCancellationReason", {
    length: 256,
  }),
});
