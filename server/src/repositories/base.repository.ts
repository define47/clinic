import { NodePgDatabase } from "drizzle-orm/node-postgres";
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

  public async getById(id: string): Promise<T> {
    return (
      await this._drizzle
        .select()
        .from(this._table)
        .where(eq(this._table[this._tableColumns[0]], id))
    )[0] as T;
  }

  private getAttributesForUUIDv5 = () => {
    let id;
    if (this._table === userTable) {
      return "userEmail";
    } else if (this._table === roleTable) {
      return "roleName";
    } else if (this._table === specialityTable) {
      return "specialityName";
    }
  };

  public async create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
  ): Promise<void> {
    let id;
    if (this._table === userTable) {
      creationAttributes = creationAttributes as UserCreationAttributes;
      id = uuidv5(creationAttributes.userEmail, getUUIDv5NamespaceEnv());
    } else if (this._table === roleTable) {
      creationAttributes = creationAttributes as RoleCreationAttributes;
      id = uuidv5(creationAttributes.roleName, getUUIDv5NamespaceEnv());
    } else if (this._table === specialityTable) {
      creationAttributes = creationAttributes as SpecialityCreationAttributes;
      id = uuidv5(creationAttributes.specialityName, getUUIDv5NamespaceEnv());
    }

    await this._drizzle
      .insert(this._table)
      .values({ [this._tableColumns[0]]: id, ...creationAttributes });
  }
}
