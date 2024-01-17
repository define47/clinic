"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorMedicalSpecialityMappingTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const user_model_1 = require("./user.model");
const medicalSpeciality_model_1 = require("./medicalSpeciality.model");
const drizzle_orm_1 = require("drizzle-orm");
exports.doctorMedicalSpecialityMappingTable = drizzle_1.clinicSchema.table("DoctorMedicalSpecialityMapping", {
    // doctorSpecialityMappingId: varchar("doctorSpecialityMappingId", {
    //   length: 256,
    // }).primaryKey(),
    doctorId: (0, pg_core_1.varchar)("doctorId")
        .notNull()
        .references(() => user_model_1.userTable.userId),
    medicalSpecialityId: (0, pg_core_1.varchar)("medicalSpecialityId")
        .notNull()
        .references(() => medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId),
    isPrimaryMedicalSpeciality: (0, pg_core_1.boolean)("isPrimaryMedicalSpeciality").notNull(),
    isSecondaryMedicalSpeciality: (0, pg_core_1.boolean)("isSecondaryMedicalSpeciality").notNull(),
    isTertiaryMedicalSpeciality: (0, pg_core_1.boolean)("isTertiaryMedicalSpeciality").notNull(),
    doctorMedicalSpecialityMappingCreatedAt: (0, pg_core_1.timestamp)("doctorMedicalSpecialityMappingCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    doctorMedicalSpecialityMappingUpdatedAt: (0, pg_core_1.timestamp)("doctorMedicalSpecialityMappingUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.doctorId, table.medicalSpecialityId] }),
    };
});
