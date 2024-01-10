import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Speciality,
  SpecialityCreationAttributes,
} from "../models/speciality.model";
import { BaseRepository } from "./base.repository";
import { ISpecialityRepository } from "./speciality.irepository";
import { Table } from "drizzle-orm";

export class SpecialityRepository
  extends BaseRepository<Speciality>
  implements ISpecialityRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getSpecialityById(
    specialityId: string
  ): Promise<Speciality | undefined> {
    return await this.getById(specialityId);
  }

  public async getSpecialityByName(
    specialityName: string
  ): Promise<Speciality | undefined> {
    return await this.getByAttribute("specialityName", specialityName);
  }

  public async createSpeciality(
    specialityCreationAttributes: SpecialityCreationAttributes
  ): Promise<Speciality | undefined> {
    return await this.create(specialityCreationAttributes);
  }

  public async updateSpeciality(
    specialityId: string,
    specialityUpdateAttributes: SpecialityCreationAttributes
  ): Promise<Speciality | undefined> {
    return await this.update(specialityId, specialityUpdateAttributes);
  }

  public async deleteSpecialityById(
    specialityId: string
  ): Promise<string | undefined> {
    return await this.delete(specialityId);
  }
}
