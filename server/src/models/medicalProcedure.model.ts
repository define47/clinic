import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";

export type MedicalProcedure = {
  medicalProcedureId: string;
  medicalProcedureName: string;
  medicalProcedurePrice: number;
  medicalProcedureCreatedAt: Date;
  medicalProcedureUpdatedAt: Date;
};

export type MedicalProcedureCreationAttributes = {
  medicalProcedureName: string;
  medicalProcedurePrice: number;
  medicalProcedureCreatedAt: Date;
  medicalProcedureUpdatedAt: Date;
};

export type MedicalProcedureUpdateAttributes = {
  medicalProcedureName: string;
  medicalProcedurePrice: number;
  medicalProcedureUpdatedAt: Date;
};

export const medicalProcedureTable = clinicSchema.table("medicalProcedure", {
  medicalProcedureId: varchar("medicalProcedureId").primaryKey(),
  medicalProcedureName: varchar("medicalProcedureName").notNull(),
  medicalProcedurePrice: integer("medicalProcedurePrice").notNull(),
  medicalProcedureCreatedAt: timestamp("medicalProcedureCreatedAt").notNull(),
  medicalProcedureUpdatedAt: timestamp("medicalProcedureUpdatedAt").notNull(),
});
