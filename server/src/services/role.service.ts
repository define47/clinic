import { Role, RoleCreationAttributes, roleTable } from "../models/role.model";
import { RoleRepository } from "../repositories/role.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IRoleService } from "./role.iservice";

export class RoleService implements IRoleService {
  private readonly _roleRepository: RoleRepository;

  public constructor() {
    this._roleRepository = new RoleRepository(drizzleInstance, roleTable);
  }

  public async getRoleById(roleId: string): Promise<Role | undefined> {
    return await this._roleRepository.getRoleById(roleId);
  }

  public async getRoleByName(roleName: string): Promise<Role | undefined> {
    return await this._roleRepository.getRoleByName(roleName);
  }

  public async createRole(
    roleCreationAttributes: RoleCreationAttributes
  ): Promise<Role | undefined> {
    return await this._roleRepository.createRole(roleCreationAttributes);
  }
}
