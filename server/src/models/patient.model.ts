import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";

export type Patient = {
  patientId?: string;
  patientCNP: string;
};

export type PatientCreationAttributes = {
  patientId: string;
  patientCNP: string;
};

export type PatientUpdateAttributes = {
  patientCNP: string;
};

export const patientTable = clinicSchema.table(
  "Patient",
  {
    patientId: varchar("patientId").references(() => userTable.userId),
    patientCNP: varchar("patientCNP", { length: 100 }).notNull(),
  },
  (table) => {
    return { pk: primaryKey({ columns: [table.patientId] }) };
  }
);
