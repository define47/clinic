"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoleMappingTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const user_model_1 = require("./user.model");
const role_model_1 = require("./role.model");
exports.userRoleMappingTable = drizzle_1.clinicSchema.table("UserRoleMapping", {
    userId: (0, pg_core_1.varchar)("userId")
        .notNull()
        .references(() => user_model_1.userTable.userId),
    roleId: (0, pg_core_1.varchar)("roleId")
        .notNull()
        .references(() => role_model_1.roleTable.roleId),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.roleId] }),
    };
});
