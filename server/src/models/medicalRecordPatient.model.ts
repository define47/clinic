import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { appointmentTable } from "./appointment.model";
import { sql } from "drizzle-orm";

export type MedicalRecordPatient = {
  medicalRecordPatientId: string;
  appointmentId: string;
  symptoms: string;
  conductedTests: string;
  diagnosis: string;
  recommendations: string;
  medicalRecordPatientCreatedAt: Date;
  medicalRecordPatientUpdatedAt: Date;
};

export type MedicalRecordPatientCreationAttributes = {
  appointmentId: string;
  symptoms: string;
  conductedTests: string;
  diagnosis: string;
  recommendations: string;
};

export type MedicalRecordPatientUpdateAttributes = {
  symptoms: string;
  conductedTests: string;
  diagnosis: string;
  recommendations: string;
  medicalRecordPatientUpdatedAt: Date;
};

export const medicalRecordPatientTable = clinicSchema.table(
  "MedicalRecordPatient",
  {
    medicalRecordPatientId: varchar("medicalRecordPatientId").primaryKey(),
    appointmentId: varchar("appointmentId", { length: 100 })
      .notNull()
      .references(() => appointmentTable.appointmentId),
    symptoms: varchar("symptoms", { length: 256 }).notNull(),
    conductedTests: varchar("conductedTests", { length: 256 }).notNull(),
    diagnosis: varchar("diagnosis", { length: 256 }).notNull(),
    recommendations: varchar("recommendations", { length: 256 }).notNull(),
    medicalRecordPatientCreatedAt: timestamp(
      "medicalRecordPatientCreatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
    medicalRecordPatientUpdatedAt: timestamp(
      "medicalRecordPatientUpdatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
  }
);
