"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPreferencesMappingTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const user_model_1 = require("./user.model");
const language_model_1 = require("./language.model");
exports.userPreferencesMappingTable = drizzle_1.clinicSchema.table("UserPreferencesMapping", {
    userId: (0, pg_core_1.varchar)("userId")
        .notNull()
        .references(() => user_model_1.userTable.userId),
    languageId: (0, pg_core_1.varchar)("languageId")
        .notNull()
        .references(() => language_model_1.languageTable.languageId),
    isDarkModeOn: (0, pg_core_1.varchar)("isDarkModeOn").notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId] }),
    };
});
