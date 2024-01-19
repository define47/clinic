import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { medicalProcedureTable } from "./medicalProcedure.model";
import { sql } from "drizzle-orm";

export type MedicalSpecialityMedicalProcedureMapping = {
  medicalSpecialityId: string;
  medicalProcedureId: string;
};

export type MedicalSpecialityMedicalProcedureMappingCreationAttributes = {
  medicalSpecialityId: string;
  medicalProcedureId: string;
};

export type MedicalSpecialityMedicalProcedureMappingUpdateAttributes = {
  medicalProcedureId: string;
};

export const medicalSpecialityMedicalProcedureMappingTable = clinicSchema.table(
  "MedicalSpecialityMedicalProcedureMapping",
  {
    medicalSpecialityId: varchar("medicalSpecialityId")
      .notNull()
      .references(() => medicalSpecialityTable.medicalSpecialityId),
    medicalProcedureId: varchar("medicalProcedureId")
      .notNull()
      .references(() => medicalProcedureTable.medicalProcedureId),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.medicalSpecialityId, table.medicalProcedureId],
      }),
    };
  }
);
