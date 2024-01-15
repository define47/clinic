import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Institution,
  InstitutionCreationAttributes,
  InstitutionUpdateAttributes,
} from "../models/institution.model";
import { BaseRepository } from "./base.repository";
import { IInstitutionRepository } from "./institution.irepository";
import { Table } from "drizzle-orm";

export class InstitutionRepository
  extends BaseRepository<Institution>
  implements IInstitutionRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getInstitutionById(
    institutionId: string
  ): Promise<Institution | undefined> {
    return await this.getById(institutionId);
  }

  public async createInstitution(
    institutionCreationAttributes: InstitutionCreationAttributes
  ): Promise<Institution | undefined> {
    return await this.create(institutionCreationAttributes);
  }

  public async updateInstitution(
    institutionId: string,
    institutionUpdateAttributes: InstitutionUpdateAttributes
  ): Promise<Institution | undefined> {
    return await this.update(institutionId, institutionUpdateAttributes);
  }
}
