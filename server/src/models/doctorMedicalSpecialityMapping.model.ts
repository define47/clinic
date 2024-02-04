import { boolean, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { clinicSchema } from "../utils/drizzle";
import { userTable } from "./user.model";
import { medicalSpecialityTable } from "./medicalSpeciality.model";
import { sql } from "drizzle-orm";

export type DoctorMedicalSpecialityMapping = {
  userId: string;
  medicalSpecialityId: string;
  isPrimaryMedicalSpeciality: boolean;
  isSecondaryMedicalSpeciality: boolean;
  isTertiaryMedicalSpeciality: boolean;
};

// export type DoctorMedicalSpecialityMappingJoinUserAndSpeciality = {
//   doctor: {
//     doctorId: string;
//     doctorForename: string;
//     doctorSurname: string;
//     doctorEmail: string;
//     doctorPhoneNumber: string;
//     doctorGender: string;
//     doctorDateOfBirth: string;
//     doctorAddress: string;
//   };
//   medicalSpeciality: {
//     medicalSpecialityId: string;
//     medicalSpecialityName: string;
//     isPrimaryMedicalSpeciality: boolean;
//     isSecondaryMedicalSpeciality: boolean;
//     isTertiaryMedicalSpeciality: boolean;
//   };
// };

export type DoctorMedicalSpecialityMappingJoinUserAndSpeciality = {
  userId: string;
  userForename: string;
  userSurname: string;
  userEmail: string;
  userPhoneNumber: string;
  userGender: string;
  userDateOfBirth: string;
  userAddress: string;
  medicalSpecialities: string[];
};

export type DoctorMedicalSpecialityMappingCreationAttributes = {
  userId: string;
  medicalSpecialityId: string;
  isPrimaryMedicalSpeciality: boolean;
  isSecondaryMedicalSpeciality: boolean;
  isTertiaryMedicalSpeciality: boolean;
};

export type DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes =
  {
    userId: string;
    medicalSpecialityId: string;
  };

export type DoctorSpecialityMappingUpdateAttributes =
  DoctorMedicalSpecialityMappingCreationAttributes;

export const doctorMedicalSpecialityMappingTable = clinicSchema.table(
  "DoctorMedicalSpecialityMapping",
  {
    // doctorSpecialityMappingId: varchar("doctorSpecialityMappingId", {
    //   length: 256,
    // }).primaryKey(),
    userId: varchar("userId")
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
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.medicalSpecialityId] }),
    };
  }
);
