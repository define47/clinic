import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type MedicalSpeciality = {
  medicalSpecialityId: string;
  medicalSpecialityName: string;
};

export type MedicalSpecialityCreationAttributes = {
  medicalSpecialityName: string;
};

export type MedicalSpecialityUpdateAttributes = {
  medicalSpecialityName: string;
};

export const medicalSpecialityTable = clinicSchema.table("MedicalSpeciality", {
  medicalSpecialityId: varchar("medicalSpecialityId").primaryKey(),
  medicalSpecialityName: varchar("medicalSpecialityName", { length: 50 })
    .notNull()
    .unique(),
});
