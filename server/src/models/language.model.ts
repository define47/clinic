import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type Language = {
  languageId: string;
  languageName: string;
};

export type LanguageCreationAttributes = {
  languageName: string;
};

export const languageTable = clinicSchema.table("Language", {
  languageId: varchar("languageId").primaryKey(),
  languageName: varchar("languageName", { length: 256 }).notNull().unique(),
  languageCreatedAt: timestamp("languageCreatedAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
  languageUpdatedAt: timestamp("languageUpdatedAt").default(
    sql`CURRENT_TIMESTAMP`
  ),
});
