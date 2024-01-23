import { DoctorMedicalSpecialityMappingJoinUserAndSpeciality } from "../models/doctorMedicalSpecialityMapping.model";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  UserRoleMappingJoinUserAndRole,
} from "../models/userRoleMapping.model";

export interface IUserRoleMappingService {
  getUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping[] | undefined>;

  getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined>;

  getAllUsersRelatedData(
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
  >;

  createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined>;

  updateUserRoleMapping(
    userId: string,
    currentRoleId: string,
    newRoleId: string
  ): Promise<UserRoleMapping | undefined>;

  deleteUserRoleMappingsByUserId(userId: string): Promise<void>;

  deleteUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping | undefined>;
}
