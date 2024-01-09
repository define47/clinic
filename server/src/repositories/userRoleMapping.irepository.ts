import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
} from "../models/userRoleMapping.model";
import { IBaseRepository } from "./base.irepository";

export interface IUserRoleMappingRepository
  extends IBaseRepository<UserRoleMapping> {
  getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined>;

  createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined>;

  deleteUserRoleMappingsByUserId(userId: string): Promise<void>;

  deleteUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<void>;
}
