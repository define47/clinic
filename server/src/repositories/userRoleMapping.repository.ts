import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  UserRoleMappingJoinUserAndRole,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import { BaseRepository } from "./base.repository";
import { IUserRoleMappingRepository } from "./userRoleMapping.irepository";
import { SQL, Table, and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { roleTable } from "../models/role.model";
import { User, userTable } from "../models/user.model";
import { PgColumn } from "drizzle-orm/pg-core";
import {
  getAdminRoleIdEnv,
  getDoctorRoleIdEnv,
  getPatientRoleIdEnv,
  getReceptionistRoleIdEnv,
} from "../utils/dotenv";
import {
  DoctorMedicalSpecialityMappingJoinUserAndSpeciality,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
import {
  MedicalSpeciality,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";

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

  public async getAllUsersRelatedData(
    roleId: string,
    searchBy: string[],
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        usersRelatedData:
          | UserRoleMappingJoinUserAndRole[]
          | DoctorMedicalSpecialityMappingJoinUserAndSpeciality[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    let columnToSearchBy1: PgColumn<any>;
    let columnToSearchBy2: PgColumn<any>;
    columnToSearchBy1 = userTable.userForename;
    columnToSearchBy2 = userTable.userForename;

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
      else if (searchBy[0] === "medicalSpecialityName")
        columnToSearchBy1 = medicalSpecialityTable.medicalSpecialityName;
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

    const columnToOrderByData = orderBy.split(":");
    let columnToOrderBy;

    if (
      columnToOrderByData[0] === "asc" &&
      columnToOrderByData[1] !== "medicalSpecialityName"
    ) {
      columnToOrderBy = asc(userTable[columnToOrderByData[1] as keyof User]);
    } else if (
      columnToOrderByData[0] === "desc" &&
      columnToOrderByData[1] !== "medicalSpecialityName"
    ) {
      columnToOrderBy = desc(userTable[columnToOrderByData[1] as keyof User]);
    } else if (
      columnToOrderByData[0] === "asc" &&
      columnToOrderByData[1] === "medicalSpecialityName"
    ) {
      columnToOrderBy = asc(medicalSpecialityTable.medicalSpecialityName);
    } else if (
      columnToOrderByData[0] === "desc" &&
      columnToOrderByData[1] === "medicalSpecialityName"
    ) {
      columnToOrderBy = desc(medicalSpecialityTable.medicalSpecialityName);
    }

    const condition = {
      userSearchQuery: and(
        eq(userRoleMappingTable.roleId, roleId),
        searchBy.length === 1
          ? ilike(columnToSearchBy1, `${searchQuery}%`)
          : searchBy.length === 2
          ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
          : sql`TRUE`
      ),
      doctorSearchQuery:
        searchBy.length === 1
          ? ilike(columnToSearchBy1, `%${searchQuery}%`)
          : searchBy.length === 2
          ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
          : sql`TRUE`,
    };

    let totalCount;
    let data;
    let offset = page * limit;

    if (
      roleId === getPatientRoleIdEnv() ||
      roleId === getAdminRoleIdEnv() ||
      roleId === getReceptionistRoleIdEnv()
    ) {
      totalCount = await this._drizzle
        .select({ totalCount: count() })
        .from(this._table)
        .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
        .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
        .where(condition.userSearchQuery);

      data = await this._drizzle
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
        .orderBy(columnToOrderBy!);

      return {
        usersRelatedData: data as UserRoleMappingJoinUserAndRole[],
        totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
        totalCount: totalCount[0].totalCount,
      };
    } else if (roleId === getDoctorRoleIdEnv()) {
      totalCount = await this._drizzle
        .select({
          totalCount: count(),
        })
        .from(doctorMedicalSpecialityMappingTable)
        .innerJoin(
          userTable,
          eq(doctorMedicalSpecialityMappingTable.doctorId, userTable.userId)
        )
        .innerJoin(
          medicalSpecialityTable,
          eq(
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
            medicalSpecialityTable.medicalSpecialityId
          )
        )
        .where(condition.doctorSearchQuery);

      data = await this._drizzle
        .select({
          doctor: {
            doctorId: userTable.userId,
            doctorForename: userTable.userForename,
            doctorSurname: userTable.userSurname,
            doctorEmail: userTable.userEmail,
            doctorPhoneNumber: userTable.userPhoneNumber,
            doctorGender: userTable.userGender,
            doctorDateOfBirth: userTable.userDateOfBirth,
            doctorAddress: userTable.userAddress,
          },
          medicalSpeciality: {
            medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
            medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
            isPrimaryMedicalSpeciality:
              doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
            isSecondaryMedicalSpeciality:
              doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
            isTertiaryMedicalSpeciality:
              doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
          },
        })
        .from(doctorMedicalSpecialityMappingTable)
        .innerJoin(
          userTable,
          eq(doctorMedicalSpecialityMappingTable.doctorId, userTable.userId)
        )
        .innerJoin(
          medicalSpecialityTable,
          eq(
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
            medicalSpecialityTable.medicalSpecialityId
          )
        )
        .where(condition.doctorSearchQuery)
        // .orderBy(
        //   asc(
        //     orderBy === "medicalSpecialityName"
        //       ? medicalSpecialityTable[orderBy as keyof MedicalSpeciality]
        //       : userTable[orderBy as keyof User]
        //   )
        // );
        .orderBy(columnToOrderBy!);

      const resultArray = Array.from(
        data
          .reduce((doctorMap, { doctor, medicalSpeciality }) => {
            const {
              doctorId,
              doctorForename,
              doctorSurname,
              doctorEmail,
              doctorPhoneNumber,
              doctorGender,
              doctorDateOfBirth,
              doctorAddress,
            } = doctor;
            const {
              medicalSpecialityName,
              isPrimaryMedicalSpeciality,
              isSecondaryMedicalSpeciality,
              isTertiaryMedicalSpeciality,
            } = medicalSpeciality;

            if (!doctorMap.has(doctorId)) {
              doctorMap.set(doctorId, {
                doctorId,
                doctorForename,
                doctorSurname,
                doctorEmail,
                doctorPhoneNumber,
                doctorGender,
                doctorDateOfBirth,
                doctorAddress,
                medicalSpecialities: [],
              });
            }

            const doctorEntry = doctorMap.get(doctorId);

            let designation = "";
            if (isPrimaryMedicalSpeciality) {
              designation = " (P)";
            } else if (isSecondaryMedicalSpeciality) {
              designation = " (S)";
            } else if (isTertiaryMedicalSpeciality) {
              designation = " (T)";
            }

            doctorEntry.medicalSpecialities.push(
              `${medicalSpecialityName}${designation}`
            );

            return doctorMap;
          }, new Map())
          .values()
      );

      return {
        usersRelatedData:
          resultArray as DoctorMedicalSpecialityMappingJoinUserAndSpeciality[],
        totalCount: totalCount![0].totalCount,
        totalPages: Math.ceil(totalCount![0].totalCount / limit) - 1,
      };
    }

    return undefined;
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
        })
    )[0];
  }

  public async deleteUserRoleMappingsByUserId(userId: string): Promise<void> {
    await this.delete(userId);
  }
}
