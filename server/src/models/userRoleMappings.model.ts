import { timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { roleTable } from "./role.model";
import { sql } from "drizzle-orm";

export type UserRoleMapping = {
  userRoleMappingId: string;
  userId: string;
  roleId: string;
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

export type UserRoleMappingUpdateAttributes = UserRoleMappingCreationAttributes;

export const userRoleMappingTable = clinicSchema.table("UserRoleMapping", {
  userRoleMappingId: varchar("userRoleMappingId", { length: 256 }).primaryKey(),
  userId: varchar("userId")
    .notNull()
    .references(() => userTable.userId),
  roleId: varchar("roleId")
    .notNull()
    .references(() => roleTable.roleId),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
