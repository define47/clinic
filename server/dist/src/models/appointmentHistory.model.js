"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentHistoryTable = exports.StatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("./user.model");
const appointment_model_1 = require("./appointment.model");
exports.StatusEnum = (0, pg_core_1.pgEnum)("appointmentStatus", [
    // pending approval => scheduled => confirmed by patient => completed (if patient makes appointment from their account)
    // scheduled => confirmed by patient => completed
    "scheduled",
    "rescheduled",
    "completed",
    "no-show",
    "pending approval", // * from reception or admin in the event that patient made appointment from their account
    "waiting", // * patient waiting
    "confirmed by patient",
    "canceled by patient",
]);
exports.appointmentHistoryTable = drizzle_1.clinicSchema.table("AppointmentHistory", {
    appointmentHistoryId: (0, pg_core_1.varchar)("appointmentHistoryId").primaryKey(),
    appointmentId: (0, pg_core_1.varchar)("appointmentId", { length: 100 })
        .notNull()
        .references(() => appointment_model_1.appointmentTable.appointmentId),
    appointmentHistoryDoctorId: (0, pg_core_1.varchar)("appointmentHistoryDoctorId", {
        length: 100,
    })
        .notNull()
        .references(() => user_model_1.userTable.userId),
    appointmentHistoryPatientId: (0, pg_core_1.varchar)("appointmentHistoryPatientId", {
        length: 100,
    })
        .notNull()
        .references(() => user_model_1.userTable.userId),
    appointmentHistoryDateTime: (0, pg_core_1.timestamp)("appointmentHistoryDateTime").notNull(),
    appointmentHistoryReason: (0, pg_core_1.varchar)("appointmentHistoryReason", {
        length: 256,
    }).notNull(),
    appointmentHistoryStatus: (0, exports.StatusEnum)("appointmentHistoryStatus")
        .default("scheduled")
        .notNull(),
    appointmentHistoryCancellationReason: (0, pg_core_1.varchar)("appointmentHistoryCancellationReason", {
        length: 256,
    }),
    appointmentHistoryCreatedBy: (0, pg_core_1.varchar)("appointmentHistoryCreatedBy", {
        length: 100,
    }).references(() => user_model_1.userTable.userId),
    appointmentHistoryUpdatedBy: (0, pg_core_1.varchar)("appointmentHistoryUpdatedBy", {
        length: 100,
    }).references(() => user_model_1.userTable.userId),
    appointmentHistoryCreatedAt: (0, pg_core_1.timestamp)("appointmentHistoryCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    appointmentHistoryUpdatedAt: (0, pg_core_1.timestamp)("appointmentHistoryUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
