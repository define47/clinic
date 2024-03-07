import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  UserRoleMappingJoinUserAndRole,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import { BaseRepository } from "./base.repository";
import { IUserRoleMappingRepository } from "./userRoleMapping.irepository";
import {
  SQL,
  Table,
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  sql,
} from "drizzle-orm";
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
import { Patient, patientTable } from "../models/patient.model";

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

  public async getUserRoleMappingsCountByRoleId(
    roleId: string
  ): Promise<number | undefined> {
    try {
      return (
        await this._drizzle
          .select({ totalCount: count() })
          .from(this._table)
          .where(eq(userRoleMappingTable.roleId, roleId))
      )[0].totalCount;
    } catch (error) {
      console.log(error);
    }
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

  public async getAllPatients(
    columnsToSearchIn: string[],
    searchQuery: string,
    columnToOrderBy: string,
    page: number,
    limit: number
  ) {
    let firstColumnToSearchIn: PgColumn<any>;
    let secondColumnToSearchIn: PgColumn<any>;
    firstColumnToSearchIn = userTable.userForename;
    secondColumnToSearchIn = userTable.userForename;
    if (columnsToSearchIn.length === 1) {
      if (
        columnsToSearchIn[0] === "userForename" ||
        columnsToSearchIn[0] === "userSurname" ||
        columnsToSearchIn[0] === "userEmail" ||
        columnsToSearchIn[0] === "userPhoneNumber"
      )
        firstColumnToSearchIn = userTable[columnsToSearchIn[0] as keyof User];
      else if (columnsToSearchIn[0] === "patientCNP")
        firstColumnToSearchIn =
          patientTable[columnsToSearchIn[0] as keyof Patient];
    } else if (columnsToSearchIn.length === 2) {
      firstColumnToSearchIn = userTable[columnsToSearchIn[0] as keyof User];
      secondColumnToSearchIn = userTable[columnsToSearchIn[1] as keyof User];
    }

    const filter = and(
      eq(userRoleMappingTable.roleId, getPatientRoleIdEnv()),
      columnsToSearchIn.length === 1
        ? ilike(firstColumnToSearchIn, `${searchQuery}%`)
        : columnsToSearchIn.length === 2
        ? sql`CONCAT(${firstColumnToSearchIn}, ' ', ${secondColumnToSearchIn}) ILIKE ${`${searchQuery}%`}`
        : sql`TRUE`
    );

    let order = asc(userTable.userForename);
    const columnToOrderByColumn = columnToOrderBy.split(":")[1];
    const columnToOrderByDirection = columnToOrderBy.split(":")[0];

    if (columnToOrderByDirection === "asc") {
      order = asc(userTable[columnToOrderByColumn as keyof User]);
    } else if (columnToOrderByDirection === "desc")
      order = desc(userTable[columnToOrderByColumn as keyof User]);

    const totalCountPatients = await this._drizzle
      .select({ totalCount: count() })
      .from(this._table)
      .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
      .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
      .leftJoin(
        patientTable,
        eq(userRoleMappingTable.userId, patientTable.patientId)
      )
      .where(filter);

    const offset = page * limit;

    const patients = await this._drizzle
      .select({
        userId: userTable.userId,
        userForename: userTable.userForename,
        userSurname: userTable.userSurname,
        userEmail: userTable.userEmail,
        userPhoneNumber: userTable.userPhoneNumber,
        userGender: userTable.userGender,
        userDateOfBirth: userTable.userDateOfBirth,
        userAddress: userTable.userAddress,
        userRoleId: userRoleMappingTable.roleId,
        userRoleName: roleTable.roleName,
        CNP: patientTable.patientCNP,
      })
      .from(this._table)
      .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
      .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
      .leftJoin(
        patientTable,
        eq(userRoleMappingTable.userId, patientTable.patientId)
      )
      .where(filter)
      .orderBy(order)
      .offset(offset)
      .limit(limit);

    return {
      tableData: patients,
      totalCount: totalCountPatients[0].totalCount,
    };
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
        tableData:
          | UserRoleMappingJoinUserAndRole[]
          | DoctorMedicalSpecialityMappingJoinUserAndSpeciality[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    throw new Error("Not implemented");
  }

  // public async getAllUsersRelatedData(
  //   roleId: string,
  //   searchBy: string[],
  //   searchQuery: string,
  //   limit: number,
  //   page: number,
  //   orderBy: string
  // ): Promise<
  //   | {
  //       tableData:
  //         | UserRoleMappingJoinUserAndRole[]
  //         | DoctorMedicalSpecialityMappingJoinUserAndSpeciality[];
  //       totalCount: number;
  //       totalPages: number;
  //     }
  //   | undefined
  // > {
  //   let columnToSearchBy1: PgColumn<any>;
  //   let columnToSearchBy2: PgColumn<any>;
  //   columnToSearchBy1 = userTable.userForename;
  //   columnToSearchBy2 = userTable.userForename;

  //   if (searchBy.length === 1) {
  //     if (searchBy[0] === "userForename")
  //       columnToSearchBy1 = userTable.userForename;
  //     else if (searchBy[0] === "userSurname")
  //       columnToSearchBy1 = userTable.userSurname;
  //     else if (searchBy[0] === "userEmail")
  //       columnToSearchBy1 = userTable.userEmail;
  //     else if (searchBy[0] === "userPhoneNumber")
  //       columnToSearchBy1 = userTable.userPhoneNumber;
  //     else if (searchBy[0] === "userGender")
  //       columnToSearchBy1 = userTable.userGender;
  //     else if (searchBy[0] === "userDateOfBirth")
  //       columnToSearchBy1 = userTable.userDateOfBirth;
  //     else if (searchBy[0] === "userAddress")
  //       columnToSearchBy1 = userTable.userAddress;
  //     else if (searchBy[0] === "medicalSpecialityName")
  //       columnToSearchBy1 = medicalSpecialityTable.medicalSpecialityName;
  //   } else if (searchBy.length === 2) {
  //     if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
  //       columnToSearchBy1 = userTable.userForename;
  //       columnToSearchBy2 = userTable.userSurname;
  //     } else if (
  //       searchBy[0] === "userSurname" &&
  //       searchBy[1] === "userForename"
  //     ) {
  //       columnToSearchBy1 = userTable.userSurname;
  //       columnToSearchBy2 = userTable.userForename;
  //     }
  //   }

  //   const columnToOrderByData = orderBy.split(":");
  //   let orderByIndicator = asc(userTable.userForename);
  //   let orderByDirection = orderBy.split(":")[0];
  //   let orderByColumn = orderBy.split(":")[1];
  //   let medicalSpecialityRank;
  //   if (orderBy.split(":").length === 3) {
  //     medicalSpecialityRank = orderBy.split(":")[2];
  //   }
  //   // console.log("orderBy", orderBy.split(":")[2]);

  //   // * Make it nicer
  //   // if (
  //   //   columnToOrderByData[0] === "asc" &&
  //   //   columnToOrderByData[1] !== "medicalSpecialityName"
  //   // ) {
  //   //   columnToOrderBy = asc(userTable[columnToOrderByData[1] as keyof User]);
  //   // } else if (
  //   //   columnToOrderByData[0] === "desc" &&
  //   //   columnToOrderByData[1] !== "medicalSpecialityName"
  //   // ) {
  //   //   columnToOrderBy = desc(userTable[columnToOrderByData[1] as keyof User]);
  //   // } else if (
  //   //   columnToOrderByData[0] === "asc" &&
  //   //   columnToOrderByData[1] === "medicalSpecialityName"
  //   // ) {
  //   //   columnToOrderBy = asc(medicalSpecialityTable.medicalSpecialityName);
  //   // } else if (
  //   //   columnToOrderByData[0] === "desc" &&
  //   //   columnToOrderByData[1] === "medicalSpecialityName"
  //   // ) {
  //   //   columnToOrderBy = desc(medicalSpecialityTable.medicalSpecialityName);
  //   // }

  //   let orderByMedicalSpecialityRank;
  //   if (
  //     orderByDirection === "asc" &&
  //     (orderByColumn === "userForename" ||
  //       orderByColumn === "userSurname" ||
  //       orderByColumn === "userEmail" ||
  //       orderByColumn === "userPhoneNumber" ||
  //       orderByColumn === "userDateOfBirth")
  //   ) {
  //     orderByIndicator = asc(userTable[orderByColumn as keyof User]);
  //   } else if (
  //     orderByDirection === "desc" &&
  //     (orderByColumn === "userForename" ||
  //       orderByColumn === "userSurname" ||
  //       orderByColumn === "userEmail" ||
  //       orderByColumn === "userPhoneNumber" ||
  //       orderByColumn === "userDateOfBirth")
  //   ) {
  //     orderByIndicator = desc(userTable[orderByColumn as keyof User]);
  //   } else if (orderByColumn === "medicalSpecialityName") {
  //     if (orderByDirection === "asc") {
  //       console.log("hereeee", medicalSpecialityRank);

  //       orderByIndicator = asc(
  //         medicalSpecialityTable[orderByColumn as keyof MedicalSpeciality]
  //       );
  //     } else if (orderByDirection === "desc") {
  //       console.log("hereeee2", medicalSpecialityRank);
  //       // orderByIndicator = desc(
  //       //   medicalSpecialityTable[orderByColumn as keyof MedicalSpeciality]
  //       // );
  //     }

  //     // if (medicalSpecialityRank === "primary")
  //     //   orderByMedicalSpecialityRank = desc(
  //     //     doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality
  //     //   );
  //     // else if (medicalSpecialityRank === "secondary")
  //     //   orderByMedicalSpecialityRank = desc(
  //     //     doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality
  //     //   );
  //     // else medicalSpecialityRank === "tertiary";
  //     // orderByMedicalSpecialityRank = desc(
  //     //   doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality
  //     // );
  //   }

  //   console.log("orderByMedicalSpecialityRank", orderByMedicalSpecialityRank);

  //   const condition = {
  //     userSearchQuery: and(
  //       eq(userRoleMappingTable.roleId, roleId),
  //       searchBy.length === 1
  //         ? ilike(columnToSearchBy1, `${searchQuery}%`)
  //         : searchBy.length === 2
  //         ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
  //         : sql`TRUE`
  //     ),
  //     doctorSearchQuery:
  //       searchBy.length === 1
  //         ? ilike(columnToSearchBy1, `${searchQuery}%`)
  //         : searchBy.length === 2
  //         ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
  //         : sql`TRUE`,
  //   };

  //   let totalCount;
  //   let data;
  //   let offset = page * limit;

  //   if (
  //     roleId === getAdminRoleIdEnv() ||
  //     roleId === getReceptionistRoleIdEnv()
  //   ) {
  //     totalCount = await this._drizzle
  //       .select({ totalCount: count() })
  //       .from(this._table)
  //       .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
  //       .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
  //       .where(condition.userSearchQuery);

  //     data = await this._drizzle
  //       .select({
  //         userId: userTable.userId,
  //         userForename: userTable.userForename,
  //         userSurname: userTable.userSurname,
  //         userEmail: userTable.userEmail,
  //         userPhoneNumber: userTable.userPhoneNumber,
  //         userGender: userTable.userGender,
  //         userDateOfBirth: userTable.userDateOfBirth,
  //         userAddress: userTable.userAddress,
  //         userRoleId: userRoleMappingTable.roleId,
  //         userRoleName: roleTable.roleName,
  //       })
  //       .from(this._table)
  //       .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
  //       .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
  //       .where(condition.userSearchQuery)
  //       .limit(limit)
  //       .offset(offset)
  //       .orderBy(orderByIndicator!);

  //     return {
  //       tableData: data as UserRoleMappingJoinUserAndRole[],
  //       totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
  //       totalCount: totalCount[0].totalCount,
  //     };
  //   } else if (roleId === getPatientRoleIdEnv()) {
  //     totalCount = await this._drizzle
  //       .select({ totalCount: count() })
  //       .from(this._table)
  //       .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
  //       .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
  //       .where(condition.userSearchQuery);

  //     data = await this._drizzle
  //       .select({
  //         userId: userTable.userId,
  //         userForename: userTable.userForename,
  //         userSurname: userTable.userSurname,
  //         userEmail: userTable.userEmail,
  //         userPhoneNumber: userTable.userPhoneNumber,
  //         userGender: userTable.userGender,
  //         userDateOfBirth: userTable.userDateOfBirth,
  //         userAddress: userTable.userAddress,
  //         userRoleId: userRoleMappingTable.roleId,
  //         userRoleName: roleTable.roleName,
  //         userCNP: patientTable.patientCNP,
  //       })
  //       .from(this._table)
  //       .innerJoin(roleTable, eq(userRoleMappingTable.roleId, roleTable.roleId))
  //       .innerJoin(userTable, eq(userRoleMappingTable.userId, userTable.userId))
  //       .leftJoin(
  //         patientTable,
  //         eq(userRoleMappingTable.userId, patientTable.patientId)
  //       )
  //       .where(condition.userSearchQuery)
  //       .limit(limit)
  //       .offset(offset)
  //       .orderBy(orderByIndicator!);

  //     return {
  //       tableData: data as UserRoleMappingJoinUserAndRole[],
  //       totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
  //       totalCount: totalCount[0].totalCount,
  //     };
  //   } else if (roleId === getDoctorRoleIdEnv()) {
  //     totalCount = await this._drizzle
  //       .select({
  //         totalCount: countDistinct(doctorMedicalSpecialityMappingTable.userId),
  //       })
  //       .from(doctorMedicalSpecialityMappingTable)
  //       .innerJoin(
  //         userTable,
  //         eq(doctorMedicalSpecialityMappingTable.userId, userTable.userId)
  //       )
  //       .innerJoin(
  //         medicalSpecialityTable,
  //         eq(
  //           doctorMedicalSpecialityMappingTable.medicalSpecialityId,
  //           medicalSpecialityTable.medicalSpecialityId
  //         )
  //       )
  //       .where(condition.doctorSearchQuery);

  //     data = await this._drizzle
  //       .select({
  //         user: {
  //           userId: userTable.userId,
  //           userForename: userTable.userForename,
  //           userSurname: userTable.userSurname,
  //           userEmail: userTable.userEmail,
  //           userPhoneNumber: userTable.userPhoneNumber,
  //           userGender: userTable.userGender,
  //           userDateOfBirth: userTable.userDateOfBirth,
  //           userAddress: userTable.userAddress,
  //         },
  //         medicalSpeciality: {
  //           medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
  //           medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
  //           isPrimaryMedicalSpeciality:
  //             doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
  //           isSecondaryMedicalSpeciality:
  //             doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
  //           isTertiaryMedicalSpeciality:
  //             doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
  //         },
  //       })
  //       .from(doctorMedicalSpecialityMappingTable)
  //       .innerJoin(
  //         userTable,
  //         eq(doctorMedicalSpecialityMappingTable.userId, userTable.userId)
  //       )
  //       .innerJoin(
  //         medicalSpecialityTable,
  //         eq(
  //           doctorMedicalSpecialityMappingTable.medicalSpecialityId,
  //           medicalSpecialityTable.medicalSpecialityId
  //         )
  //       )
  //       .where(condition.doctorSearchQuery)
  //       .orderBy(
  //         desc(doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality),
  //         // asc(medicalSpecialityTable.medicalSpecialityName)
  //         orderByIndicator!
  //         // medicalSpecialityRank
  //         // orderByMedicalSpecialityRank
  //       );

  //     const resultArray = Array.from(
  //       data
  //         .reduce((doctorMap, { user, medicalSpeciality }) => {
  //           const {
  //             userId,
  //             userForename,
  //             userSurname,
  //             userEmail,
  //             userPhoneNumber,
  //             userGender,
  //             userDateOfBirth,
  //             userAddress,
  //           } = user;
  //           const {
  //             medicalSpecialityName,
  //             isPrimaryMedicalSpeciality,
  //             isSecondaryMedicalSpeciality,
  //             isTertiaryMedicalSpeciality,
  //           } = medicalSpeciality;

  //           if (!doctorMap.has(userId)) {
  //             doctorMap.set(userId, {
  //               userId,
  //               userForename,
  //               userSurname,
  //               userEmail,
  //               userPhoneNumber,
  //               userGender,
  //               userDateOfBirth,
  //               userAddress,
  //               medicalSpecialities: [],
  //               userRoleName: "doctor",
  //             });
  //           }

  //           const doctorEntry = doctorMap.get(userId);

  //           let designation = "";
  //           if (isPrimaryMedicalSpeciality) {
  //             designation = " (P)";
  //           } else if (isSecondaryMedicalSpeciality) {
  //             designation = " (S)";
  //           } else if (isTertiaryMedicalSpeciality) {
  //             designation = " (T)";
  //           }

  //           doctorEntry.medicalSpecialities.push(
  //             `${medicalSpecialityName}${designation}`
  //           );

  //           return doctorMap;
  //         }, new Map())
  //         .values()
  //     ).slice(offset, limit + offset);

  //     return {
  //       tableData:
  //         resultArray as DoctorMedicalSpecialityMappingJoinUserAndSpeciality[],
  //       totalCount: totalCount![0].totalCount,
  //       totalPages: Math.ceil(totalCount![0].totalCount / limit) - 1,
  //     };
  //   }

  //   return undefined;
  // }

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
