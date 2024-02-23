import { varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { roleTable } from "./role.model";

export const permissionTable = clinicSchema.table("RolePermissionMapping", {
  permissionId: varchar("permissionId").primaryKey(),
  roleId: varchar("roleId")
    .notNull()
    .references(() => roleTable.roleId),
  permissionName: varchar("permissionName", { length: 100 }).notNull(),
});
