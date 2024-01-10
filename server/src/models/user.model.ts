import {
  date,
  pgEnum,
  pgSchema,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export type User = {
  userId: string;
  userForename: string;
  userSurname: string;
  userEmail: string;
  userPhoneNumber: string;
  userGender: string;
  userDateOfBirth: string;
  userAddress: string;
  userEncryptedPassword?: string;
};

export type UserCreationAttributes = {
  userForename: string;
  userSurname: string;
  userEmail: string;
  userPhoneNumber: string;
  userGender: string;
  userDateOfBirth: string;
  userAddress: string;
  userEncryptedPassword: string;
};

export type UserUpdateAttributes = {
  userForename: string;
  userSurname: string;
  userEmail: string;
  userPhoneNumber: string;
  userGender: string;
  userDateOfBirth: string;
  userAddress: string;
  userEncryptedPassword?: string;
};

export const GenderEnum = pgEnum("userGender", ["male", "female"]);

export const userTable = clinicSchema.table("User", {
  userId: varchar("userId").primaryKey(),
  userForename: varchar("userForename", { length: 100 }).notNull(),
  userSurname: varchar("userSurname", { length: 100 }).notNull(),
  userEmail: varchar("userEmail", { length: 256 }).notNull().unique(),
  userPhoneNumber: varchar("userPhoneNumber", { length: 50 })
    .notNull()
    .unique(),
  userGender: GenderEnum("userGender").notNull(),
  userDateOfBirth: date("userDateOfBirth").notNull(),
  userAddress: varchar("userAddress", { length: 256 }).notNull(),
  userEncryptedPassword: varchar("userEncryptedPassword", {
    length: 256,
  }).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});
