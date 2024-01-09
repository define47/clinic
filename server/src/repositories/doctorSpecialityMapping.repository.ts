import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  DoctorSpecialityMapping,
  DoctorSpecialityMappingCreationAttributes,
  doctorSpecialityMappingTable,
} from "../models/doctorSpecialityMapping.model";
import { BaseRepository } from "./base.repository";
import { IDoctorSpecialityMappingRepository } from "./doctorSpecialityMapping.irepository";
import { Table, and, eq } from "drizzle-orm";

export class DoctorSpecialityMappingRepository
  extends BaseRepository<DoctorSpecialityMapping>
  implements IDoctorSpecialityMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getDoctorSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorSpecialityMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(doctorSpecialityMappingTable)
      .where(eq(doctorSpecialityMappingTable.doctorId, doctorId));
  }

  public async createDoctorSpecialityMapping(
    doctorSpecialityMappingCreationAttributes: DoctorSpecialityMappingCreationAttributes
  ): Promise<DoctorSpecialityMapping | undefined> {
    return await this.create(doctorSpecialityMappingCreationAttributes);
  }

  public async deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId(
    doctorId: string,
    specialityId: string
  ): Promise<string> {
    return (
      await this._drizzle
        .delete(doctorSpecialityMappingTable)
        .where(
          and(
            eq(doctorSpecialityMappingTable.doctorId, doctorId),
            eq(doctorSpecialityMappingTable.specialityId, specialityId)
          )
        )
        .returning({ specialityId: doctorSpecialityMappingTable.specialityId })
    )[0]?.specialityId;
  }

  public async deleteDoctorSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<void> {
    console.log(await this.delete(doctorId));

    // await this.delete(doctorId)
  }
}
