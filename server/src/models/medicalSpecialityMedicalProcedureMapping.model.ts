import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { medicalProcedureTable } from "./medicalProcedure.model";
import { sql } from "drizzle-orm";

export type medicalSpecialityMedicalProcedureMapping = {
  medicalSpecialityId: string;
  medicalProcedureId: string;
  medicalSpecialityMedicalProcedureMappingCreatedAt: Date;
  medicalSpecialityMedicalProcedureMappingUpdatedAt: Date;
};

export const medicalSpecialityMedicalProcedureMappingTable = clinicSchema.table(
  "SpecialityProcedureMapping",
  {
    medicalSpecialityId: varchar("medicalSpecialityId")
      .notNull()
      .references(() => medicalSpecialityTable.medicalSpecialityId),
    medicalProcedureId: varchar("medicalProcedureId")
      .notNull()
      .references(() => medicalProcedureTable.medicalProcedureId),
    medicalSpecialityMedicalProcedureMappingCreatedAt: timestamp(
      "medicalSpecialityMedicalProcedureMappingCreatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
    medicalSpecialityMedicalProcedureMappingUpdatedAt: timestamp(
      "medicalSpecialityMedicalProcedureMappingUpdatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.medicalSpecialityId, table.medicalProcedureId],
      }),
    };
  }
);
