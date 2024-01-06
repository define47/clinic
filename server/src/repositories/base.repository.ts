import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IBaseRepository } from "./base.irepository";
import { PgInsertValue, PgTableWithColumns } from "drizzle-orm/pg-core";
import { User, UserCreationAttributes, userTable } from "../models/user.model";
import { eq } from "drizzle-orm";
import { v5 as uuidv5 } from "uuid";
import { getUUIDv5NamespaceEnv } from "../utils/dotenv";
import { RoleCreationAttributes, roleTable } from "../models/role.model";

export class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly _drizzle: NodePgDatabase<Record<string, never>>;
  protected readonly _table: PgTableWithColumns<any>;
  protected readonly returningObject: Record<string, any> = {};
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,

    table: PgTableWithColumns<any>
  ) {
    this._drizzle = drizzle;
    this._table = table;

    let tableColumns;

    if (this._table === userTable)
      tableColumns = [
        "userId",
        "userForename",
        "userSurname",
        "userEmail",
        "userPhoneNumber",
        "userGender",
        "userDateOfBirth",
        "userAddress",
        "userEncryptedPassword",
        "createdAt",
        "updatedAt",
      ] as const;

    for (const key in tableColumns) {
      this.returningObject[key] = userTable[key as keyof User];
    }
  }

  public async getById(id: string): Promise<T> {
    return (
      await this._drizzle
        .select()
        .from(this._table)
        .where(eq(this._table[this.returningObject[0]], id))
    )[0] as T;
  }

  public async create(
    creationAttributes: UserCreationAttributes | RoleCreationAttributes
  ): Promise<void> {
    let id;
    if (this._table === userTable) {
      creationAttributes = creationAttributes as UserCreationAttributes;
      id = uuidv5(creationAttributes.userEmail, getUUIDv5NamespaceEnv());
    } else if (this._table === roleTable) {
      creationAttributes = creationAttributes as RoleCreationAttributes;
      id = uuidv5(creationAttributes.roleName, getUUIDv5NamespaceEnv());
    }

    console.log(id);

    await this._drizzle
      .insert(this._table)
      .values({ userId: id, ...creationAttributes });
  }
}
