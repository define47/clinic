import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
} from "../models/userRoleMappings.model";
import { BaseRepository } from "./base.repository";
import { IUserRoleMappingRepository } from "./userRolesMapping.irepository";

export class UserRoleMappingRepository
  extends BaseRepository<UserRoleMapping>
  implements IUserRoleMappingRepository
{
  public async createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined> {
    return await this.create(userRoleMappingCreationAttributes);
  }
}
