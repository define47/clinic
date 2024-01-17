import { boolean, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { sql } from "drizzle-orm";

export type DoctorMedicalSpecialityMapping = {
  doctorId: string;
  medicalSpecialityId: string;
  isPrimaryMedicalSpeciality: boolean;
  isSecondaryMedicalSpeciality: boolean;
  isTertiaryMedicalSpeciality: boolean;
};

export type DoctorMedicalSpecialityMappingJoinUserAndSpeciality = {
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
  medicalSpeciality: {
    medicalSpecialityId: string;
    medicalSpecialityName: string;
    isPrimaryMedicalSpeciality: boolean;
    isSecondaryMedicalSpeciality: boolean;
    isTertiaryMedicalSpeciality: boolean;
  };
};

export type DoctorMedicalSpecialityMappingCreationAttributes = {
  doctorId: string;
  medicalSpecialityId: string;
  isPrimaryMedicalSpeciality: boolean;
  isSecondaryMedicalSpeciality: boolean;
  isTertiaryMedicalSpeciality: boolean;
};

export type DoctorSpecialityMappingUpdateAttributes =
  DoctorMedicalSpecialityMappingCreationAttributes;

export const doctorMedicalSpecialityMappingTable = clinicSchema.table(
  "DoctorMedicalSpecialityMapping",
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
    doctorMedicalSpecialityMappingCreatedAt: timestamp(
      "doctorMedicalSpecialityMappingCreatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
    doctorMedicalSpecialityMappingUpdatedAt: timestamp(
      "doctorMedicalSpecialityMappingUpdatedAt"
    ).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.doctorId, table.medicalSpecialityId] }),
    };
  }
);
