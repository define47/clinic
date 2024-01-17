import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type MedicalSpeciality = {
  medicalSpecialityId: string;
  medicalSpecialityName: string;
  medicalSpecialityCreatedAt: Date;
  medicalSpecialityUpdatedAt: Date;
};

export type MedicalSpecialityCreationAttributes = {
  medicalSpecialityName: string;
};

export type MedicalSpecialityUpdateAttributes = {
  medicalSpecialityName: string;
  medicalSpecialityUpdatedAt: Date;
};

export const medicalSpecialityTable = clinicSchema.table("MedicalSpeciality", {
  medicalSpecialityId: varchar("medicalSpecialityId").primaryKey(),
  medicalSpecialityName: varchar("medicalSpecialityName", { length: 50 })
    .notNull()
    .unique(),
  medicalSpecialityCreatedAt: timestamp("createdAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
  medicalSpecialityUpdatedAt: timestamp("updatedAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
});
