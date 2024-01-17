"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = exports.GenderEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_1 = require("../utils/drizzle");
const drizzle_orm_1 = require("drizzle-orm");
exports.GenderEnum = (0, pg_core_1.pgEnum)("userGender", ["male", "female"]);
exports.userTable = drizzle_1.clinicSchema.table("User", {
    userId: (0, pg_core_1.varchar)("userId").primaryKey(),
    userForename: (0, pg_core_1.varchar)("userForename", { length: 100 }).notNull(),
    userSurname: (0, pg_core_1.varchar)("userSurname", { length: 100 }).notNull(),
    userEmail: (0, pg_core_1.varchar)("userEmail", { length: 256 }).notNull().unique(),
    userPhoneNumber: (0, pg_core_1.varchar)("userPhoneNumber", { length: 50 })
        .notNull()
        .unique(),
    userGender: (0, exports.GenderEnum)("userGender").notNull(),
    userDateOfBirth: (0, pg_core_1.date)("userDateOfBirth").notNull(),
    userAddress: (0, pg_core_1.varchar)("userAddress", { length: 256 }).notNull(),
    userEncryptedPassword: (0, pg_core_1.varchar)("userEncryptedPassword", {
        length: 256,
    }).notNull(),
    isUserEmailActivated: (0, pg_core_1.boolean)("isUserEmailActivated")
        .default(false)
        .notNull(),
    isUserApprovedByAdmin: (0, pg_core_1.boolean)("isUserApprovedByAdmin")
        .default(false)
        .notNull(),
    isUserBanned: (0, pg_core_1.boolean)("isUserBanned").default(false).notNull(),
    userCreatedAt: (0, pg_core_1.timestamp)("userCreatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    userUpdatedAt: (0, pg_core_1.timestamp)("userUpdatedAt").default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
});
