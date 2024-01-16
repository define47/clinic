import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { medicalProcedureTable } from "./medicalProcedure.model";

export const specialityMedicalProcedureMappingTable = clinicSchema.table(
  "SpecialityProcedureMapping",
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
