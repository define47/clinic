import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type MedicalSpeciality = {
  specialityId: string;
  specialityName: string;
  medicalSpecialityCreatedAt: Date;
  medicalSpecialityUpdatedAt: Date;
};

export type MedicalSpecialityCreationAttributes = {
  specialityName: string;
};

export type MedicalSpecialityUpdateAttributes = {
  specialityName: string;
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
