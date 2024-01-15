import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type Institution = {
  institutionId: string;
  institutionName: string;
  institutionCreatedAt: string;
  institutionUpdatedAt: string;
};

export type InstitutionCreationAttributes = {
  institutionName: string;
};

export type InstitutionUpdateAttributes = {
  institutionName: string;
};

export const institutionTable = clinicSchema.table("Institution", {
  institutionId: varchar("institutionId", { length: 256 }).primaryKey(),
  institutionName: varchar("institutionName", { length: 256 }).notNull(),
  institutionCreatedAt: timestamp("institutionCreatedAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
  institutionUpdatedAt: timestamp("institutionUpdatedAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
});
