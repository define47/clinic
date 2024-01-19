"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentTable = exports.StatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const user_model_1 = require("./user.model");
exports.StatusEnum = (0, pg_core_1.pgEnum)("appointmentStatus", [
    // pending approval => scheduled => confirmed by patient => completed (if patient makes appointment from their account)
    // scheduled => confirmed by patient => completed
    "scheduled",
    "rescheduled",
    "completed", // * by doctors to set
    "no-show",
    "pending approval", // * from reception or admin in the event that patient made appointment from their account
    "waiting", // * patient waiting
    "confirmed by patient",
    "canceled by patient",
    "paid",
]);
exports.appointmentTable = drizzle_1.clinicSchema.table("Appointment", {
    appointmentId: (0, pg_core_1.varchar)("appointmentId").primaryKey(),
    appointmentDoctorId: (0, pg_core_1.varchar)("appointmentDoctorId", { length: 100 })
        .notNull()
        .references(() => user_model_1.userTable.userId),
    appointmentPatientId: (0, pg_core_1.varchar)("appointmentPatientId", { length: 100 })
        .notNull()
        .references(() => user_model_1.userTable.userId),
    appointmentDateTime: (0, pg_core_1.timestamp)("appointmentDateTime").notNull(),
    appointmentReason: (0, pg_core_1.varchar)("appointmentReason", { length: 256 }).notNull(),
    appointmentStatus: (0, exports.StatusEnum)("appointmentStatus")
        .default("scheduled")
        .notNull(),
    appointmentCancellationReason: (0, pg_core_1.varchar)("appointmentCancellationReason", {
        length: 256,
    }),
});
