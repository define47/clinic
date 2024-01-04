import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type Speciality = {
  specialityId: string;
  specialityName: string;
};

export type SpecialityCreationAttributes = {
  specialityName: string;
};

export type SpecialityUpdateAttributes = SpecialityCreationAttributes;

export const specialityTable = clinicSchema.table("Speciality", {
  specialityId: varchar("specialityId").primaryKey(),
  specialityName: varchar("specialityName", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
