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
  medicalSpecialityCreatedAt: timestamp("medicalSpecialityCreatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  medicalSpecialityUpdatedAt: timestamp("medicalSpecialityUpdatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
