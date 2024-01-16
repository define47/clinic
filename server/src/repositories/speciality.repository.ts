import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
} from "../models/medicalSpeciality.model";
import { BaseRepository } from "./base.repository";
import { ISpecialityRepository } from "./speciality.irepository";
import { Table } from "drizzle-orm";

export class SpecialityRepository
  extends BaseRepository<MedicalSpeciality>
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
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getById(specialityId);
  }

  public async getSpecialityByName(
    specialityName: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getByAttribute("specialityName", specialityName);
  }

  public async createSpeciality(
    specialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this.create(specialityCreationAttributes);
  }

  public async updateSpeciality(
    specialityId: string,
    specialityUpdateAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this.update(specialityId, specialityUpdateAttributes);
  }

  public async deleteSpecialityById(
    specialityId: string
  ): Promise<string | undefined> {
    return await this.delete(specialityId);
  }
}
