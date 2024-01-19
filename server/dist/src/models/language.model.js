"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
exports.languageTable = drizzle_1.clinicSchema.table("Language", {
    languageId: (0, pg_core_1.varchar)("languageId").primaryKey(),
    languageName: (0, pg_core_1.varchar)("languageName", { length: 256 }).notNull().unique(),
    languageCode: (0, pg_core_1.varchar)("languageCode", { length: 256 }).notNull().unique(),
});
