import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import { BaseRepository } from "./base.repository";
import { IUserRoleMappingRepository } from "./userRoleMapping.irepository";
import { Table, and, eq } from "drizzle-orm";

export class UserRoleMappingRepository
  extends BaseRepository<UserRoleMapping>
  implements IUserRoleMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(userRoleMappingTable)
      .where(eq(userRoleMappingTable.userId, userId));
  }

  public async createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined> {
    return await this.create(userRoleMappingCreationAttributes);
  }

  public async deleteUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<string> {
    return (
      await this._drizzle
        .delete(userRoleMappingTable)
        .where(
          and(
            eq(userRoleMappingTable.userId, userId),
            eq(userRoleMappingTable.roleId, roleId)
          )
        )
        .returning({ roleId: userRoleMappingTable.roleId })
    )[0]?.roleId;
  }

  public async deleteUserRoleMappingsByUserId(userId: string): Promise<void> {
    await this.delete(userId);
  }
}
