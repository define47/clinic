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
  SpecialityCreationAttributes,
  SpecialityUpdateAttributes,
  specialityTable,
} from "../models/speciality.model";
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
        "isUserActivated",
        "isUserApprovedByAdmin",
        "isUserBanned",
        "userCreatedAt",
        "userUpdatedAt",
      ];
    else if (table === roleTable) this._tableColumns = ["roleId", "roleName"];
    else if (table === specialityTable)
      this._tableColumns = ["specialityId", "specialityName"];
    else if (table === userRoleMappingTable)
      this._tableColumns = ["userId", "roleId"];
    else if (table === doctorSpecialityMappingTable)
      this._tableColumns = [
        "doctorId",
        "specialityId",
        "isPrimarySpeciality",
        "isSecondarySpeciality",
        "isTertiarySpeciality",
      ];
    else if (table === appointmentTable)
      this._tableColumns = [
        "appointmentId",
        "appointmentDoctorId",
        "appointmentPatientId",
        "appointmentReason",
        "appointmentCancellationReason",
        "appointmentDateTime",
        "appointmentStatus",
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
      ];
    else if (table === languageTable)
      this._tableColumns = ["languageId", "languageName", "languageCode"];
    else if (table === userPreferencesMappingTable)
      this._tableColumns = ["userId", "languageId", "isDarkModeOn"];
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
      | SpecialityCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
    )
  > {
    if (this._table === userTable) {
      return ["userEmail"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === roleTable) {
      return ["roleName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === specialityTable) {
      return ["specialityName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === userRoleMappingTable) {
      return ["userId", "roleId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === doctorSpecialityMappingTable) {
      return ["doctorId", "specialityId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === appointmentTable) {
      return [
        "appointmentDoctorId",
        "appointmentPatientId",
        "appointmentDateTime",
      ] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
      );
    } else if (this._table === appointmentHistoryTable) {
      return [
        "appointmentId",
        "appointmentHistoryCreatedAt",
        "appointmentHistoryUpdatedAt",
      ] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
      );
    } else if (this._table === medicalRecordPatientTable)
      return ["appointmentId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
      );
    else if (this._table === languageTable)
      return ["languageName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
        | MedicalRecordPatientCreationAttributes
        | LanguageCreationAttributes
      );
    else {
      return "" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
        | AppointmentCreationAttributes
        | AppointmentHistoryCreationAttributes
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
      | SpecialityCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
      | UserPreferencesMappingCreationAttributes
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
      | SpecialityUpdateAttributes
      | AppointmentUpdateAttributes
      | UserRoleMappingUpdateAttributes
      | DoctorSpecialityMappingUpdateAttributes
      | AppointmentUpdateAttributes
      | MedicalRecordPatientUpdateAttributes
      | UserPreferencesMappingUpdateAttributes
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
