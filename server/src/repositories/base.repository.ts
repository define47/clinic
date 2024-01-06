import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { IBaseRepository } from "./base.irepository";
import { PgInsertValue, PgTableWithColumns } from "drizzle-orm/pg-core";
import { User, UserCreationAttributes, userTable } from "../models/user.model";
import { eq } from "drizzle-orm";
import { v5 as uuidv5 } from "uuid";
import { getUUIDv5NamespaceEnv } from "../utils/dotenv";
import { RoleCreationAttributes, roleTable } from "../models/role.model";
import {
  SpecialityCreationAttributes,
  specialityTable,
} from "../models/speciality.model";

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

  private getAttributesForUUIDv5(): keyof (
    | UserCreationAttributes
    | RoleCreationAttributes
    | SpecialityCreationAttributes
  ) {
    if (this._table === userTable) {
      return "userEmail" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
      );
    } else if (this._table === roleTable) {
      return "roleName" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
      );
    } else if (this._table === specialityTable) {
      return "specialityName" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
      );
    } else {
      return "" as keyof (
        | UserCreationAttributes
        | RoleCreationAttributes
        | SpecialityCreationAttributes
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

  public async create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
  ): Promise<T> {
    let id;
    const UUIDv5Attribute = this.getAttributesForUUIDv5();
    // if (this._table === userTable) {
    //   creationAttributes = creationAttributes as UserCreationAttributes;
    //   id = uuidv5(creationAttributes.userEmail, getUUIDv5NamespaceEnv());
    // } else if (this._table === roleTable) {
    //   creationAttributes = creationAttributes as RoleCreationAttributes;
    //   id = uuidv5(creationAttributes.roleName, getUUIDv5NamespaceEnv());
    // } else if (this._table === specialityTable) {
    //   creationAttributes = creationAttributes as SpecialityCreationAttributes;
    //   id = uuidv5(creationAttributes.specialityName, getUUIDv5NamespaceEnv());
    // }

    id = uuidv5(creationAttributes[UUIDv5Attribute], getUUIDv5NamespaceEnv());

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
  }

  public async update(
    id: string,
    updateAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
  ): Promise<T> {
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
  }

  public async delete(id: string): Promise<string> {
    await this._drizzle
      .delete(this._table)
      .where(eq(this._table[this._tableColumns[0]], id));

    return id;
  }
}
