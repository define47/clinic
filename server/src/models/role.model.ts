import {
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type Role = {
  roleId: string;
  roleName: string;
};

export type RoleCreationAttributes = {
  roleName: string;
};

export type RoleUpdateAttributes = {
  roleName: string;
};

export const roleTable = clinicSchema.table("Role", {
  roleId: varchar("roleId").primaryKey(),
  roleName: varchar("roleName", { length: 50 }).notNull().unique(),
});
