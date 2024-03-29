import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type Language = {
  languageId: string;
  languageName: string;
  languageCode: string;
};

export type LanguageCreationAttributes = {
  languageName: string;
  languageCode: string;
};

export const languageTable = clinicSchema.table("Language", {
  languageId: varchar("languageId").primaryKey(),
  languageName: varchar("languageName", { length: 256 }).notNull().unique(),
  languageCode: varchar("languageCode", { length: 256 }).notNull().unique(),
});
