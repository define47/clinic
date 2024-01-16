import { boolean, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { sql } from "drizzle-orm";

export type DoctorSpecialityMapping = {
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
    // doctorSpecialityMappingId: varchar("doctorSpecialityMappingId", {
    //   length: 256,
    // }).primaryKey(),
    doctorId: varchar("doctorId")
      .notNull()
      .references(() => userTable.userId),
    medicalSpecialityId: varchar("medicalSpecialityId")
      .notNull()
      .references(() => medicalSpecialityTable.medicalSpecialityId),
    isPrimaryMedicalSpeciality: boolean("isPrimaryMedicalSpeciality").notNull(),
    isSecondaryMedicalSpeciality: boolean(
      "isSecondaryMedicalSpeciality"
    ).notNull(),
    isTertiaryMedicalSpeciality: boolean(
      "isTertiaryMedicalSpeciality"
    ).notNull(),
    doctorSpecialityMappingCreatedAt: timestamp(
      "doctorSpecialityMappingCreatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
    doctorSpecialityMappingUpdatedAt: timestamp(
      "doctorSpecialityMappingUpdatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.doctorId, table.medicalSpecialityId] }),
    };
  }
);
