"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalSpecialityTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
exports.medicalSpecialityTable = drizzle_1.clinicSchema.table("MedicalSpeciality", {
    medicalSpecialityId: (0, pg_core_1.varchar)("medicalSpecialityId").primaryKey(),
    medicalSpecialityName: (0, pg_core_1.varchar)("medicalSpecialityName", { length: 50 })
        .notNull()
        .unique(),
    medicalSpecialityCreatedAt: (0, pg_core_1.timestamp)("medicalSpecialityCreatedAt")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
    medicalSpecialityUpdatedAt: (0, pg_core_1.timestamp)("medicalSpecialityUpdatedAt")
        .default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`)
        .notNull(),
});
