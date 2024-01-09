import { boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { specialityTable } from "./speciality.model";
import { sql } from "drizzle-orm";

export type DoctorSpecialityMapping = {
  doctorSpecialityMappingId: string;
  doctorId: string;
  specialityId: string;
  isPrimarySpeciality: boolean;
  isSecondarySpeciality: boolean;
  isTertiarySpeciality: boolean;
};

export type DoctorSpecialityMappingJoinUserAndSpeciality = {
  doctor: {
    doctorId: string;
    doctorForename: string;
    doctorSurname: string;
    doctorEmail: string;
    doctorPhoneNumber: string;
    doctorGender: string;
    doctorDateOfBirth: string;
    doctorAddress: string;
  };
  speciality: {
    specialityId: string;
    specialityName: string;
    isPrimarySpeciality: boolean;
    isSecondarySpeciality: boolean;
    isTertiarySpeciality: boolean;
  };
};

export type DoctorSpecialityMappingCreationAttributes = {
  doctorId: string;
  specialityId: string;
  isPrimarySpeciality: boolean;
  isSecondarySpeciality: boolean;
  isTertiarySpeciality: boolean;
};

export type DoctorSpecialityMappingUpdateAttributes =
  DoctorSpecialityMappingCreationAttributes;

export const doctorSpecialityMappingTable = clinicSchema.table(
  "DoctorSpecialityMapping",
  {
    doctorSpecialityMappingId: varchar("doctorSpecialityMappingId", {
      length: 256,
    }).primaryKey(),
    doctorId: varchar("doctorId")
      .notNull()
      .references(() => userTable.userId),
    specialityId: varchar("specialityId")
      .notNull()
      .references(() => specialityTable.specialityId),
    isPrimarySpeciality: boolean("isPrimarySpeciality").notNull(),
    isSecondarySpeciality: boolean("isSecondarySpeciality").notNull(),
    isTertiarySpeciality: boolean("isTertiarySpeciality").notNull(),
    createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  }
);
