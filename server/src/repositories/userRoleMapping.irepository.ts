import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
} from "../models/userRoleMapping.model";
import { IBaseRepository } from "./base.irepository";

export interface IUserRoleMappingRepository
  extends IBaseRepository<UserRoleMapping> {
  createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined>;
}
