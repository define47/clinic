import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
} from "../models/userRoleMapping.model";

export interface IUserRoleMappingService {
  getUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping[] | undefined>;

  getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined>;

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
