import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { roleTable } from "./role.model";
import { sql } from "drizzle-orm";

// export type UserRoleMapping = {
//   userRoleMappingId: string;
//   userId: string;
//   roleId: string;
// };

export type UserRoleMapping = {
  userId: string;
  roleId: string;
  userRoleMappingCreatedAt: Date;
  userRoleMappingUpdatedAt: Date;
};

export type UserRoleMappingJoinUserAndRole = {
  user: {
    userId: string;
    userForename: string;
    userSurname: string;
    userEmail: string;
    userPhoneNumber: string;
    userGender: string;
    userDateOfBirth: string;
    userAddress: string;
  };
  role: {
    roleId: string;
    roleName: string;
  };
};

export type UserRoleMappingCreationAttributes = {
  userId: string;
  roleId: string;
};

export type UserRoleMappingUpdateAttributes = {
  userId: string;
  roleId: string;
  userRoleMappingUpdatedAt: Date;
};

export const userRoleMappingTable = clinicSchema.table(
  "UserRoleMapping",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => userTable.userId),
    roleId: varchar("roleId")
      .notNull()
      .references(() => roleTable.roleId),
    userRoleMappingCreatedAt: timestamp("userRoleMappingCreatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    userRoleMappingUpdatedAt: timestamp("userRoleMappingUpdatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.roleId] }),
    };
  }
);
