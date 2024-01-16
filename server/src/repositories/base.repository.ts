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
  DoctorSpecialityMappingCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
  doctorSpecialityMappingTable,
} from "../models/doctorSpecialityMapping.model";
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
import { specialityMedicalProcedureMappingTable } from "../models/specialityMedicalProcedureMapping.model";

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
        "isUserBanned",
        "userCreatedAt",
        "userUpdatedAt",
      ];
    else if (table === roleTable)
      this._tableColumns = [
        "roleId",
        "roleName",
        "roleCreatedAt",
        "roleUpdatedAt",
      ];
    else if (table === medicalSpecialityTable)
      this._tableColumns = [
        "medicalSpecialityId",
        "medicalSpecialityName",
        "medicalSpecialityCreatedAt",
        "medicalSpecialityUpdatedAt",
      ];
    else if (table === userRoleMappingTable)
      this._tableColumns = [
        "userId",
        "roleId",
        "userRoleMappingCreatedAt",
        "userRoleMappingUpdatedAt",
      ];
    else if (table === doctorSpecialityMappingTable)
      this._tableColumns = [
        "doctorId",
        "medicalSpecialityId",
        "isPrimaryMedicalSpeciality",
        "isSecondaryMedicalSpeciality",
        "isTertiaryMedicalSpeciality",
        "doctorSpecialityMappingCreatedAt",
        "doctorSpecialityMappingUpdatedAt",
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
        "appointmentCreatedAt",
        "appointmentUpdatedAt",
      ];
    else if (table === appointmentHistoryTable)
      this._tableColumns = [
        "appointmentHistoryId",
        "appointmentId",
        "appointmentHistoryDoctorId",
        "appointmentHistoryPatientId",
        "appointmentHistoryDateTime",
        "appointmentHistoryStatus",
        "appointmentHistoryReason",
        "appointmentHistoryCancellationReason",
        "appointmentHistoryCreatedAt",
        "appointmentHistoryUpdatedAt",
        "appointmentHistoryCreatedBy",
        "appointmentHistoryUpdatedBy",
      ];
    else if (table === medicalRecordPatientTable)
      this._tableColumns = [
        "medicalRecordPatientId",
        "appointmentId",
        "symptoms",
        "conductedTests",
        "diagnosis",
        "recommendations",
        "medicalRecordPatientCreatedAt",
        "medicalRecordPatientUpdatedAt",
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
        "medicalProcedureCreatedAt",
        "medicalProcedureUpdatedAt",
      ];
    else if (table === specialityMedicalProcedureMappingTable)
      this._tableColumns = ["specialityId", "medicalProcedureId"];
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

  private getAttributesForUUIDv5(): Array<
    keyof (
      | UserCreationAttributes
      | RoleCreationAttributes
      | MedicalSpecialityCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
      | MedicalProcedureCreationAttributes
    )
  > {
    if (this._table === userTable) {
      return ["userEmail"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === roleTable) {
      return ["roleName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === medicalSpecialityTable) {
      return ["specialityName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === userRoleMappingTable) {
      return ["userId", "roleId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === doctorSpecialityMappingTable) {
      return ["doctorId", "specialityId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === appointmentTable) {
      return [
        "appointmentDoctorId",
        "appointmentPatientId",
        "appointmentDateTime",
      ] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === appointmentHistoryTable) {
      return [
        "appointmentId",
        "appointmentHistoryCreatedAt",
        "appointmentHistoryUpdatedAt",
      ] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    } else if (this._table === medicalRecordPatientTable)
      return ["appointmentId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    else if (this._table === languageTable)
      return ["languageName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    else if (this._table === medicalProcedureTable)
      return ["medicalName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    else {
      return "" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | MedicalSpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
        | MedicalProcedureCreationAttributes
      );
    }
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
      | DoctorSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
      | UserPreferencesMappingCreationAttributes
      | MedicalProcedureCreationAttributes
  ): Promise<T | undefined> {
    try {
      let id;
      const UUIDv5Attributes = this.getAttributesForUUIDv5();

      if (UUIDv5Attributes.length === 1)
        id = uuidv5(
          creationAttributes[UUIDv5Attributes[0]],
          getUUIDv5NamespaceEnv()
        );
      else if (UUIDv5Attributes.length === 2)
        id = uuidv5(
          `${creationAttributes[UUIDv5Attributes[0]]} ${
            creationAttributes[UUIDv5Attributes[1]]
          }`,
          getUUIDv5NamespaceEnv()
        );
      else if (UUIDv5Attributes.length === 3)
        id = uuidv5(
          `${creationAttributes[UUIDv5Attributes[0]]} ${
            creationAttributes[UUIDv5Attributes[1]]
          } ${creationAttributes[UUIDv5Attributes[2]]}`,
          getUUIDv5NamespaceEnv()
        );

      const entityAttributes: Record<string, any> = {};

      entityAttributes[this._tableColumns[0]] =
        this._table[this._tableColumns[0] as keyof T];

      for (const key in creationAttributes) {
        entityAttributes[key] = this._table[key as keyof T];
      }

      // console.log(returningObject);

      if (
        this._table === userRoleMappingTable ||
        this._table === doctorSpecialityMappingTable
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
        await this._drizzle
          .delete(this._table)
          .where(eq(this._table[this._tableColumns[1]], id));
      await this._drizzle
        .delete(this._table)
        .where(eq(this._table[this._tableColumns[0]], id));

      return id;
    } catch (error) {
      console.log(error);
    }
  }
}
