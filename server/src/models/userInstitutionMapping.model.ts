import { clinicSchema } from "../utils/drizzle";
import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { userTable } from "./user.model";
import { institutionTable } from "./institution.model";

export const userInstitutionMapping = clinicSchema.table(
  "UserInstitutionMapping",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => userTable.userId),
    institutionId: varchar("roleId")
      .notNull()
      .references(() => institutionTable.institutionId),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.institutionId] }),
    };
  }
);
