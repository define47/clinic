"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalSpecialityMedicalProcedureMappingTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const medicalSpeciality_model_1 = require("./medicalSpeciality.model");
const medicalProcedure_model_1 = require("./medicalProcedure.model");
const drizzle_orm_1 = require("drizzle-orm");
exports.medicalSpecialityMedicalProcedureMappingTable = drizzle_1.clinicSchema.table("MedicalSpecialityMedicalProcedureMapping", {
    medicalSpecialityId: (0, pg_core_1.varchar)("medicalSpecialityId")
        .notNull()
        .references(() => medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId),
    medicalProcedureId: (0, pg_core_1.varchar)("medicalProcedureId")
        .notNull()
        .references(() => medicalProcedure_model_1.medicalProcedureTable.medicalProcedureId),
    medicalSpecialityMedicalProcedureMappingCreatedAt: (0, pg_core_1.timestamp)("medicalSpecialityMedicalProcedureMappingCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    medicalSpecialityMedicalProcedureMappingUpdatedAt: (0, pg_core_1.timestamp)("medicalSpecialityMedicalProcedureMappingUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({
            columns: [table.medicalSpecialityId, table.medicalProcedureId],
        }),
    };
});
