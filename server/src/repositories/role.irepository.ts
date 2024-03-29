import { Role, RoleCreationAttributes } from "../models/role.model";
import { IBaseRepository } from "./base.irepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  getRoleById(roleId: string): Promise<Role | undefined>;

  getRoleByName(roleName: string): Promise<Role | undefined>;

  createRole(
    roleCreationAttributes: RoleCreationAttributes
  ): Promise<Role | undefined>;
}
