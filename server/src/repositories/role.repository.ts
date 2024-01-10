import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Role, RoleCreationAttributes } from "../models/role.model";
import { BaseRepository } from "./base.repository";
import { IRoleRepository } from "./role.irepository";
import { Table } from "drizzle-orm";

export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getRoleById(roleId: string): Promise<Role | undefined> {
    return this.getById(roleId);
  }

  public async getRoleByName(roleName: string): Promise<Role | undefined> {
    return await this.getByAttribute("roleName", roleName);
  }

  public async createRole(
    roleCreationAttributes: RoleCreationAttributes
  ): Promise<Role | undefined> {
    return await this.create(roleCreationAttributes);
  }
}
