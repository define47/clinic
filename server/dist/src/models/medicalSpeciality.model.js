"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalSpecialityTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
exports.medicalSpecialityTable = drizzle_1.clinicSchema.table("MedicalSpeciality", {
    medicalSpecialityId: (0, pg_core_1.varchar)("medicalSpecialityId").primaryKey(),
    medicalSpecialityName: (0, pg_core_1.varchar)("medicalSpecialityName", { length: 50 })
        .notNull()
        .unique(),
});
