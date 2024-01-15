import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { languageTable } from "./language.model";

export type UserPreferencesMapping = {
  userId: string;
  languageId: string;
  isDarkModeOn: boolean;
};

export type UserPreferencesMappingCreationAttributes = {
  userId: string;
  languageId: string;
  isDarkModeOn: boolean;
};

export type UserPreferencesMappingUpdateAttributes = {
  languageId: string;
  isDarkModeOn: boolean;
};

export const userPreferencesMapping = clinicSchema.table(
  "UserPreferencesMapping",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => userTable.userId),
    languageId: varchar("languageId")
      .notNull()
      .references(() => languageTable.languageId),
    isDarkModeOn: varchar("isDarkModeOn").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId] }),
    };
  }
);
