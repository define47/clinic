"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalProcedureTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
exports.medicalProcedureTable = drizzle_1.clinicSchema.table("MedicalProcedure", {
    medicalProcedureId: (0, pg_core_1.varchar)("medicalProcedureId").primaryKey(),
    medicalProcedureName: (0, pg_core_1.varchar)("medicalProcedureName").notNull(),
    medicalProcedurePrice: (0, pg_core_1.integer)("medicalProcedurePrice").notNull(),
    medicalProcedureCreatedAt: (0, pg_core_1.timestamp)("medicalProcedureCreatedAt").notNull(),
    medicalProcedureUpdatedAt: (0, pg_core_1.timestamp)("medicalProcedureUpdatedAt").notNull(),
});
