import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
} from "../models/medicalSpeciality.model";
import { BaseRepository } from "./base.repository";
import { IMedicalSpecialityRepository } from "./medicalSpeciality.irepository";
import { Table } from "drizzle-orm";

export class MedicalSpecialityRepository
  extends BaseRepository<MedicalSpeciality>
  implements IMedicalSpecialityRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getMedicalSpecialityById(
    specialityId: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getById(specialityId);
  }

  public async getMedicalSpecialityByName(
    specialityName: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getByAttribute("specialityName", specialityName);
  }

  public async createMedicalSpeciality(
    specialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this.create(specialityCreationAttributes);
  }

  public async updateMedicalSpeciality(
    medicalSpecialityId: string,
    medicalSpecialityUpdateAttributes: MedicalSpecialityUpdateAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this.update(
      medicalSpecialityId,
      medicalSpecialityUpdateAttributes
    );
  }

  public async deleteMedicalSpecialityById(
    specialityId: string
  ): Promise<string | undefined> {
    return await this.delete(specialityId);
  }
}
