import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { IBaseRepository } from "./base.irepository";
import { PgInsertValue, PgTableWithColumns } from "drizzle-orm/pg-core";
import {
  User,
  UserCreationAttributes,
  UserUpdateAttributes,
  userTable,
} from "../models/user.model";
import { eq } from "drizzle-orm";
import { v5 as uuidv5 } from "uuid";
import { v4 as uuidv4 } from "uuid";

import { getUUIDv5NamespaceEnv } from "../utils/dotenv";
import {
  RoleCreationAttributes,
  RoleUpdateAttributes,
  roleTable,
} from "../models/role.model";
import {
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";
import {
  UserRoleMappingCreationAttributes,
  UserRoleMappingUpdateAttributes,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import {
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
import {
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
  appointmentTable,
} from "../models/appointment.model";
import {
  AppointmentHistoryCreationAttributes,
  appointmentHistoryTable,
} from "../models/appointmentHistory.model";
import {
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
  medicalRecordPatientTable,
} from "../models/medicalRecordPatient.model";
import {
  LanguageCreationAttributes,
  languageTable,
} from "../models/language.model";
import {
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
  userPreferencesMappingTable,
} from "../models/userPreferencesMapping.model";
import {
  MedicalProcedureCreationAttributes,
  MedicalProcedureUpdateAttributes,
  medicalProcedureTable,
} from "../models/medicalProcedure.model";
import {
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
  medicalSpecialityMedicalProcedureMappingTable,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import {
  NotificationCreationAttributes,
  notificationTable,
} from "../models/notification.model";
import {
  UserNotificationMappingCreationAttributes,
  userNotificationMappingTable,
} from "../models/userNotificationMapping.model";
import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
  patientTable,
} from "../models/patient.model";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly _drizzle: NodePgDatabase<Record<string, never>>;
  protected readonly _table: PgTableWithColumns<any>;
  protected readonly _tableColumns: string[];

  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: PgTableWithColumns<any>
  ) {
    this._drizzle = drizzle;
    this._table = table;

    if (this._table === userTable)
      this._tableColumns = [
        "userId",
        "userForename",
        "userSurname",
        "userEmail",
        "userPhoneNumber",
        "userGender",
        "userDateOfBirth",
        "userAddress",
        "userEncryptedPassword",
        "isUserEmailActivated",
        "isUserApprovedByAdmin",
        "isUserSuspended",
        "isUserBanned",
      ];
    else if (table === roleTable) this._tableColumns = ["roleId", "roleName"];
    else if (table === medicalSpecialityTable)
      this._tableColumns = ["medicalSpecialityId", "medicalSpecialityName"];
    else if (table === userRoleMappingTable)
      this._tableColumns = ["userId", "roleId"];
    else if (table === doctorMedicalSpecialityMappingTable)
      this._tableColumns = [
        "doctorMedicalSpecialityMappingId",
        "userId",
        "medicalSpecialityId",
        "isPrimaryMedicalSpeciality",
        "isSecondaryMedicalSpeciality",
        "isTertiaryMedicalSpeciality",
      ];
    else if (table === appointmentTable)
      this._tableColumns = [
        "appointmentId",
        "appointmentDoctorId",
        "appointmentPatientId",
        "appointmentDateTime",
        "appointmentReason",
        "appointmentStatus",
        "appointmentCancellationReason",
        "appointmentPrice",
      ];
    else if (table === appointmentHistoryTable)
      this._tableColumns = [
        "appointmentHistoryId",
        "appointmentId",
        "appointmentHistoryDoctorId",
        "appointmentHistoryPatientId",
        "appointmentHistoryDateTime",
        "appointmentHistoryReason",
        "appointmentHistoryStatus",
        "appointmentHistoryCancellationReason",
        "appointmentHistoryCreatedBy",
        "appointmentHistoryUpdatedBy",
        "appointmentHistoryCreatedAt",
        "appointmentHistoryUpdatedAt",
      ];
    else if (table === medicalRecordPatientTable)
      this._tableColumns = [
        "medicalRecordPatientId",
        "appointmentId",
        "symptoms",
        "conductedTests",
        "diagnosis",
        "recommendations",
      ];
    else if (table === languageTable)
      this._tableColumns = ["languageId", "languageName", "languageCode"];
    else if (table === userPreferencesMappingTable)
      this._tableColumns = ["userId", "languageId", "isDarkModeOn"];
    else if (table === medicalProcedureTable)
      this._tableColumns = [
        "medicalProcedureId",
        "medicalProcedureName",
        "medicalProcedurePrice",
      ];
    else if (table === medicalSpecialityMedicalProcedureMappingTable)
      this._tableColumns = ["medicalSpecialityId", "medicalProcedureId"];
    else if (table === notificationTable)
      this._tableColumns = [
        "notificationId",
        "notificationSenderId",
        "notificationAction",
        "notificationEntity",
        "notificationBody",
        "notificationDateTime",
      ];
    else if (table === userNotificationMappingTable)
      this._tableColumns = [
        "receiverId",
        "notificationId",
        "isNotificationRead",
      ];
    else if (table === patientTable)
      this._tableColumns = ["patientId", "patientCNP"];
    else this._tableColumns = [];

    // type MyKeys = keyof typeof this._table.$inferSelect;
    // type MyObject = Record<MyKeys, any>;

    // const dummyVariable: MyObject = {
    //   userId: "",
    //   userForename: "test1fn",
    //   userSurname: "test1ln",
    //   userEmail: "test1em",
    //   userPhoneNumber: "test1ph",
    //   userGender: "male",
    //   userDateOfBirth: "1234-01-01",
    //   userAddress: "test1addr",
    //   userEncryptedPassword: "test1pass",
    //   createdAt: "",
    //   updatedAt: "",
    // };
    // console.log("here", Object.keys(dummyVariable));
  }

  public async getById(id: string): Promise<T> {
    return (
      await this._drizzle
        .select()
        .from(this._table)
        .where(eq(this._table[this._tableColumns[0]], id))
    )[0] as T;
  }

  public async getByAttribute(key: any, value: any): Promise<T | undefined> {
    return (
      await this._drizzle
        .select()
        .from(this._table)
        .where(eq(this._table[key], value))
    )[0] as T;
  }

  public async create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | MedicalSpecialityCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorMedicalSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
      | UserPreferencesMappingCreationAttributes
      | MedicalProcedureCreationAttributes
      | MedicalSpecialityMedicalProcedureMappingCreationAttributes
      | DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
      | NotificationCreationAttributes
      | UserNotificationMappingCreationAttributes
      | PatientCreationAttributes
  ): Promise<T | undefined> {
    try {
      let id;

      // if (this._table === userTable) {
      // id = uuidv5(
      //   (creationAttributes as UserCreationAttributes).userEmail + "-" + new Date(),
      //   getUUIDv5NamespaceEnv()
      // );
      // } else if (this._table === roleTable) {
      // id = uuidv5(
      //   (creationAttributes as RoleCreationAttributes).roleName,
      //   getUUIDv5NamespaceEnv()
      // );
      // } else if (this._)

      switch (this._table) {
        case userTable:
          id = uuidv5(
            (creationAttributes as UserCreationAttributes).userEmail +
              "-" +
              new Date(),
            getUUIDv5NamespaceEnv()
          );
          break;
        case roleTable:
          id = uuidv5(
            (creationAttributes as RoleCreationAttributes).roleName,
            getUUIDv5NamespaceEnv()
          );
          break;
        case medicalSpecialityTable:
          id = uuidv5(
            (creationAttributes as MedicalSpecialityCreationAttributes)
              .medicalSpecialityName,
            getUUIDv5NamespaceEnv()
          );
          break;
        case medicalProcedureTable:
          id = uuidv5(
            (creationAttributes as MedicalProcedureCreationAttributes)
              .medicalProcedureName,
            getUUIDv5NamespaceEnv()
          );
          break;
        case doctorMedicalSpecialityMappingTable:
          creationAttributes =
            creationAttributes as DoctorMedicalSpecialityMappingCreationAttributes;
          id = uuidv5(
            `${creationAttributes.userId}-${creationAttributes.medicalSpecialityId}`,
            getUUIDv5NamespaceEnv()
          );
          break;
        case appointmentTable:
          let random = uuidv4();
          creationAttributes =
            creationAttributes as AppointmentCreationAttributes;
          id = uuidv5(
            `${creationAttributes.appointmentPatientId}-${
              creationAttributes.appointmentDoctorId
            }-${creationAttributes.appointmentDateTime.toISOString()}-${new Date()}-${random}`,
            getUUIDv5NamespaceEnv()
          );
          break;
        case appointmentHistoryTable:
          creationAttributes =
            creationAttributes as AppointmentHistoryCreationAttributes;

          id = uuidv5(
            `${creationAttributes.appointmentId}-${new Date()}`,
            getUUIDv5NamespaceEnv()
          );
          break;
        case medicalRecordPatientTable:
          id = uuidv5(
            (creationAttributes as MedicalRecordPatientCreationAttributes)
              .appointmentId,
            getUUIDv5NamespaceEnv()
          );
          break;
        case languageTable:
          id = uuidv5(
            (creationAttributes as LanguageCreationAttributes).languageName,
            getUUIDv5NamespaceEnv()
          );
          break;
        case notificationTable:
          creationAttributes =
            creationAttributes as NotificationCreationAttributes;
          id = uuidv5(
            `${creationAttributes.notificationDateTime.toISOString()}-${
              creationAttributes.notificationSenderId
            }`,
            getUUIDv5NamespaceEnv()
          );
          break;
        default:
          break;
      }

      // console.log("generated ID", id);

      const entityAttributes: Record<string, any> = {};

      entityAttributes[this._tableColumns[0]] =
        this._table[this._tableColumns[0] as keyof T];

      for (const key in creationAttributes) {
        entityAttributes[key] = this._table[key as keyof T];
      }

      // console.log(returningObject);

      if (
        this._table === userRoleMappingTable ||
        this._table === userNotificationMappingTable ||
        this._table === userPreferencesMappingTable ||
        this._table === medicalSpecialityMedicalProcedureMappingTable ||
        this._table === patientTable
      )
        return (
          await this._drizzle
            .insert(this._table)
            .values({ ...creationAttributes })
            .returning(entityAttributes)
        )[0] as T;

      return (
        await this._drizzle
          .insert(this._table)
          .values({ [this._tableColumns[0]]: id, ...creationAttributes })
          .returning(entityAttributes)
      )[0] as T;
    } catch (error) {
      console.log(error);
    }
  }

  // public async create(
  //   creationAttributes:
  //     | UserCreationAttributes
  //     | RoleCreationAttributes
  //     | MedicalSpecialityCreationAttributes
  //     | UserRoleMappingCreationAttributes
  //     | DoctorMedicalSpecialityMappingCreationAttributes
  //     | AppointmentCreationAttributes
  //     | AppointmentHistoryCreationAttributes
  //     | MedicalRecordPatientCreationAttributes
  //     | LanguageCreationAttributes
  //     | UserPreferencesMappingCreationAttributes
  //     | MedicalProcedureCreationAttributes
  //     | MedicalSpecialityMedicalProcedureMappingCreationAttributes
  //     | DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
  // ): Promise<T | undefined> {
  //   try {
  //     let id;
  //     const UUIDv5Attributes = this.getNecessaryAttributesForUUIDv5();

  //     if (UUIDv5Attributes.length === 1)
  //       id = uuidv5(
  //         creationAttributes[UUIDv5Attributes[0]] + "-" + new Date(),
  //         getUUIDv5NamespaceEnv()
  //       );
  //     else if (UUIDv5Attributes.length === 2)
  //       id = uuidv5(
  //         `${creationAttributes[UUIDv5Attributes[0]]}-${
  //           creationAttributes[UUIDv5Attributes[1]]
  //         }-${new Date()}`,
  //         getUUIDv5NamespaceEnv()
  //       );
  //     else if (UUIDv5Attributes.length === 3)
  //       id = uuidv5(
  //         `${creationAttributes[UUIDv5Attributes[0]]}-${
  //           creationAttributes[UUIDv5Attributes[1]]
  //         }-${creationAttributes[UUIDv5Attributes[2]]}-${new Date()}`,
  //         getUUIDv5NamespaceEnv()
  //       );

  //     const entityAttributes: Record<string, any> = {};

  //     entityAttributes[this._tableColumns[0]] =
  //       this._table[this._tableColumns[0] as keyof T];

  //     for (const key in creationAttributes) {
  //       entityAttributes[key] = this._table[key as keyof T];
  //     }

  //     // console.log(returningObject);

  //     if (this._table === userRoleMappingTable)
  //       return (
  //         await this._drizzle
  //           .insert(this._table)
  //           .values({ ...creationAttributes })
  //           .returning(entityAttributes)
  //       )[0] as T;

  //     return (
  //       await this._drizzle
  //         .insert(this._table)
  //         .values({ [this._tableColumns[0]]: id, ...creationAttributes })
  //         .returning(entityAttributes)
  //     )[0] as T;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  public async update(
    id: string,
    updateAttributes:
      | UserUpdateAttributes
      | RoleUpdateAttributes
      | MedicalSpecialityUpdateAttributes
      | AppointmentUpdateAttributes
      | UserRoleMappingUpdateAttributes
      | DoctorSpecialityMappingUpdateAttributes
      | AppointmentUpdateAttributes
      | MedicalRecordPatientUpdateAttributes
      | UserPreferencesMappingUpdateAttributes
      | MedicalProcedureUpdateAttributes
      | MedicalSpecialityMedicalProcedureMappingUpdateAttributes
      | PatientUpdateAttributes
  ): Promise<T | undefined> {
    try {
      const entityAttributes: Record<string, any> = {};

      // entityAttributes[this._tableColumns[0]] =
      //   this._table[this._tableColumns[0] as keyof T];

      // for (const key in updateAttributes) {
      //   entityAttributes[key] = this._table[key as keyof T];
      // }

      // const dummyObject: Appointment = {
      //   appointmentId: "",
      //   appointmentDoctorId: "",
      //   appointmentPatientId: "",
      //   appointmentReason: "",
      //   appointmentDateTime: new Date(),
      //   appointmentStatus: "",
      //   appointmentCancellationReason: "",
      // };

      for (const key in this._tableColumns) {
        // console.log(key);

        entityAttributes[this._tableColumns[key]] =
          this._table[this._tableColumns[key] as keyof T];
      }

      // console.log(entityAttributes[0]);

      return (
        await this._drizzle
          .update(this._table)
          .set(updateAttributes)
          .where(eq(this._table[this._tableColumns[0]], id))
          .returning(entityAttributes)
      )[0] as T;
    } catch (error) {
      console.log(error);
    }
  }

  public async delete(id: string): Promise<string | undefined> {
    try {
      if (
        this._table === appointmentHistoryTable ||
        this._table === medicalRecordPatientTable
      )
        return (
          await this._drizzle
            .delete(this._table)
            .where(eq(this._table[this._tableColumns[1]], id))
            .returning({ id: this._table[this._tableColumns[1]] })
        )[0].id;
      return (
        await this._drizzle
          .delete(this._table)
          .where(eq(this._table[this._tableColumns[0]], id))
          .returning({ id: this._table[this._tableColumns[0]] })
      )[0]?.id;

      // if (idt) return idt;
      // return undefined;

      // return id;
    } catch (error) {
      console.log(error);
    }
  }
}
