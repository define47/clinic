"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
exports.roleTable = drizzle_1.clinicSchema.table("Role", {
    roleId: (0, pg_core_1.varchar)("roleId").primaryKey(),
    roleName: (0, pg_core_1.varchar)("roleName", { length: 50 }).notNull().unique(),
    roleCreatedAt: (0, pg_core_1.timestamp)("roleCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    roleUpdatedAt: (0, pg_core_1.timestamp)("roleUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
