import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  UserRoleMappingJoinUserAndRole,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import { BaseRepository } from "./base.repository";
import { IUserRoleMappingRepository } from "./userRoleMapping.irepository";
import { Table, and, asc, count, eq, ilike, sql } from "drizzle-orm";
import { roleTable } from "../models/role.model";
import { User, userTable } from "../models/user.model";
import { PgColumn } from "drizzle-orm/pg-core";

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

  public async getUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(userRoleMappingTable)
      .where(
        and(
          eq(userRoleMappingTable.userId, userId),
          eq(userRoleMappingTable.roleId, roleId)
        )
      );
  }

  /*
   * getting all roles for a certain user
   */
  public async getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(userRoleMappingTable)
      .where(eq(userRoleMappingTable.userId, userId));
  }

  public async getAllUserRolesMappingsByRole(
    roleId: string,
    searchBy: string[],
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        userRoleMappingJoinUserAndRole: UserRoleMappingJoinUserAndRole[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    let columnToSearchBy1: PgColumn<any>;
    let columnToSearchBy2: PgColumn<any>;
    columnToSearchBy1 = userTable.userCreatedAt;
    columnToSearchBy2 = userTable.userCreatedAt;

    if (searchBy.length === 1) {
      if (searchBy[0] === "userForename")
        columnToSearchBy1 = userTable.userForename;
      else if (searchBy[0] === "userSurname")
        columnToSearchBy1 = userTable.userSurname;
      else if (searchBy[0] === "userEmail")
        columnToSearchBy1 = userTable.userEmail;
      else if (searchBy[0] === "userPhoneNumber")
        columnToSearchBy1 = userTable.userPhoneNumber;
      else if (searchBy[0] === "userGender")
        columnToSearchBy1 = userTable.userGender;
      else if (searchBy[0] === "userDateOfBirth")
        columnToSearchBy1 = userTable.userDateOfBirth;
      else if (searchBy[0] === "userAddress")
        columnToSearchBy1 = userTable.userAddress;
    } else if (searchBy.length === 2) {
      if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
        columnToSearchBy1 = userTable.userForename;
        columnToSearchBy2 = userTable.userSurname;
      } else if (
        searchBy[0] === "userSurname" &&
        searchBy[1] === "userForename"
      ) {
        columnToSearchBy1 = userTable.userSurname;
        columnToSearchBy2 = userTable.userForename;
      }
    }

    const condition = {
      userSearchQuery: and(
        eq(userRoleMappingTable.roleId, roleId),
        searchBy.length === 1
          ? ilike(columnToSearchBy1, `%${searchQuery}%`)
          : searchBy.length === 2
          ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`%${searchQuery}%`}`
          : sql`TRUE`
      ),
    };

    const totalCount = await this._drizzle
      .select({ totalCount: count() })
      .from(this._table)
      .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
      .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
      .where(condition.userSearchQuery);

    const offset = page * limit;

    const userRoleMappingJoinUserAndRole = await this._drizzle
      .select({
        user: {
          userId: userTable.userId,
          userForename: userTable.userForename,
          userSurname: userTable.userSurname,
          userEmail: userTable.userEmail,
          userPhoneNumber: userTable.userPhoneNumber,
          userGender: userTable.userGender,
          userDateOfBirth: userTable.userDateOfBirth,
          userAddress: userTable.userAddress,
        },
        role: {
          roleId: userRoleMappingTable.roleId,
          roleName: roleTable.roleName,
        },
      })
      .from(this._table)
      .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
      .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
      .where(condition.userSearchQuery)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(userTable[orderBy as keyof User]));

    return {
      userRoleMappingJoinUserAndRole,
      totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
      totalCount: totalCount[0].totalCount,
    };
  }

  public async createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined> {
    return await this.create(userRoleMappingCreationAttributes);
  }

  /*
   * updating a role for a certain user
   */
  public async updateUserRoleMapping(
    userId: string,
    currentRoleId: string,
    newRoleId: string
  ): Promise<UserRoleMapping | undefined> {
    return (
      await this._drizzle
        .update(userRoleMappingTable)
        .set({ roleId: newRoleId })
        .where(
          and(
            eq(userRoleMappingTable.userId, userId),
            eq(userRoleMappingTable.roleId, currentRoleId)
          )
        )
        .returning({
          userId: userRoleMappingTable.userId,
          roleId: userRoleMappingTable.roleId,
          userRoleMappingCreatedAt:
            userRoleMappingTable.userRoleMappingCreatedAt,
          userRoleMappingUpdatedAt:
            userRoleMappingTable.userRoleMappingUpdatedAt,
        })
    )[0];
  }

  public async deleteUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping | undefined> {
    return (
      await this._drizzle
        .delete(userRoleMappingTable)
        .where(
          and(
            eq(userRoleMappingTable.userId, userId),
            eq(userRoleMappingTable.roleId, roleId)
          )
        )
        .returning({
          userId: userRoleMappingTable.userId,
          roleId: userRoleMappingTable.roleId,
          userRoleMappingCreatedAt:
            userRoleMappingTable.userRoleMappingCreatedAt,
          userRoleMappingUpdatedAt:
            userRoleMappingTable.userRoleMappingUpdatedAt,
        })
    )[0];
  }

  public async deleteUserRoleMappingsByUserId(userId: string): Promise<void> {
    await this.delete(userId);
  }
}
