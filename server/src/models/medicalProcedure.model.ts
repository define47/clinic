import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";

export type MedicalProcedure = {
  medicalProcedureId: string;
  medicalProcedureName: string;
  medicalProcedurePrice: number;
};

export type MedicalProcedureCreationAttributes = {
  medicalProcedureName: string;
  medicalProcedurePrice: number;
};

export type MedicalProcedureUpdateAttributes = {
  medicalProcedureName: string;
  medicalProcedurePrice: number;
};

export const medicalProcedureTable = clinicSchema.table("MedicalProcedure", {
  medicalProcedureId: varchar("medicalProcedureId").primaryKey(),
  medicalProcedureName: varchar("medicalProcedureName").notNull().unique(),
  medicalProcedurePrice: integer("medicalProcedurePrice").notNull(),
});
