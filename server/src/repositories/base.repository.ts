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
  userRolesMappingsTable,
} from "../models/userRolesMappings.model";
import {
  DoctorSpecialityMappingCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
  doctorSpecialitiesMappingsTable,
} from "../models/doctorSpecialitiesMappings";
import {
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
  appointmentTable,
} from "../models/appointment.model";

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
      ];
    else if (table === roleTable) this._tableColumns = ["roleId", "roleName"];
    else if (table === specialityTable)
      this._tableColumns = ["specialityId", "specialityName"];
    else if (table === userRolesMappingsTable)
      this._tableColumns = ["userRoleMappingId", "userId", "roleId"];
    else if (table === doctorSpecialitiesMappingsTable)
      this._tableColumns = [
        "doctorSpecialityMappingId",
        "doctorId",
        "specialityId",
        "isPrimarySpeciality",
        "isSecondarySpeciality",
        "isTertiarySpeciality",
      ];
    else if (table === appointmentTable)
      this._tableColumns = [
        "appointmentId",
        "doctorId",
        "patientId",
        "appointmentReason",
        "appointmentCancellationReason",
        "appointmentDateTime",
        "appointmentStatus",
      ];
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
    )
  > {
    if (this._table === userTable) {
      return ["userEmail"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
      );
    } else if (this._table === roleTable) {
      return ["roleName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
      );
    } else if (this._table === specialityTable) {
      return ["specialityName"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
      );
    } else if (this._table === userRolesMappingsTable) {
      return ["userId", "roleId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
      );
    } else if (this._table === doctorSpecialitiesMappingsTable) {
      return ["doctorId", "specialityId"] as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
      );
    } else {
      return "" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
        | UserRoleMappingCreationAttributes
        | DoctorSpecialityMappingCreationAttributes
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
      | AppointmentCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorSpecialityMappingCreationAttributes
  ): Promise<T | undefined> {
    try {
      let id;
      const UUIDv5Attributes = this.getAttributesForUUIDv5();

      console.log(UUIDv5Attributes);

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

      const entityAttributes: Record<string, any> = {};

      entityAttributes[this._tableColumns[0]] =
        this._table[this._tableColumns[0] as keyof T];

      for (const key in creationAttributes) {
        entityAttributes[key] = this._table[key as keyof T];
      }

      // console.log(returningObject);

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
  ): Promise<T | undefined> {
    try {
      const entityAttributes: Record<string, any> = {};

      entityAttributes[this._tableColumns[0]] =
        this._table[this._tableColumns[0] as keyof T];

      for (const key in updateAttributes) {
        entityAttributes[key] = this._table[key as keyof T];
      }

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
      await this._drizzle
        .delete(this._table)
        .where(eq(this._table[this._tableColumns[0]], id));

      return id;
    } catch (error) {
      console.log(error);
    }
  }
}
