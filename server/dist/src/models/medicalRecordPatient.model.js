"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecordPatientTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const appointment_model_1 = require("./appointment.model");
const drizzle_orm_1 = require("drizzle-orm");
exports.medicalRecordPatientTable = drizzle_1.clinicSchema.table("MedicalRecordPatient", {
    medicalRecordPatientId: (0, pg_core_1.varchar)("medicalRecordPatientId").primaryKey(),
    appointmentId: (0, pg_core_1.varchar)("appointmentId", { length: 100 })
        .notNull()
        .references(() => appointment_model_1.appointmentTable.appointmentId),
    symptoms: (0, pg_core_1.varchar)("symptoms", { length: 256 }).notNull(),
    conductedTests: (0, pg_core_1.varchar)("conductedTests", { length: 256 }).notNull(),
    diagnosis: (0, pg_core_1.varchar)("diagnosis", { length: 256 }).notNull(),
    recommendations: (0, pg_core_1.varchar)("recommendations", { length: 256 }).notNull(),
    medicalRecordPatientCreatedAt: (0, pg_core_1.timestamp)("medicalRecordPatientCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    medicalRecordPatientUpdatedAt: (0, pg_core_1.timestamp)("medicalRecordPatientUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
