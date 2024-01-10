import { Role, RoleCreationAttributes } from "../models/role.model";

export interface IRoleService {
  getRoleById(roleId: string): Promise<Role | undefined>;

  getRoleByName(roleName: string): Promise<Role | undefined>;

  createRole(
    roleCreationAttributes: RoleCreationAttributes
  ): Promise<Role | undefined>;
}
