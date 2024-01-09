import { Role, RoleCreationAttributes } from "../models/role.model";
import { IBaseRepository } from "./base.irepository";

export interface IRoleRepository extends IBaseRepository<Role> {
  createRole(
    roleCreationAttributes: RoleCreationAttributes
  ): Promise<Role | undefined>;
}
