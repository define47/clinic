import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
import { BaseRepository } from "./base.repository";
import { IDoctorSpecialityMappingRepository } from "./doctorMedicalSpecialityMapping.irepository";
import { Table, and, eq } from "drizzle-orm";
import {
  MedicalSpeciality,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";

export class DoctorMedicalSpecialityMappingRepository
  extends BaseRepository<DoctorMedicalSpecialityMapping>
  implements IDoctorSpecialityMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(doctorMedicalSpecialityMappingTable)
      .where(eq(doctorMedicalSpecialityMappingTable.userId, doctorId));
  }

  public async createDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.create(doctorMedicalSpecialityMappingCreationAttributes);
  }

  public async createPrimaryDoctorMedicalSpecialityMapping(
    primaryDoctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.create({
      ...primaryDoctorMedicalSpecialityMappingCreationAttributes,
      isPrimaryMedicalSpeciality: true,
      isSecondaryMedicalSpeciality: false,
      isTertiaryMedicalSpeciality: false,
    });
  }

  public async createSecondaryDoctorMedicalSpecialityMapping(
    secondaryDoctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.create({
      ...secondaryDoctorMedicalSpecialityMappingCreationAttributes,
      isPrimaryMedicalSpeciality: false,
      isSecondaryMedicalSpeciality: true,
      isTertiaryMedicalSpeciality: false,
    });
  }

  public async createTertiaryDoctorMedicalSpecialityMapping(
    tertiaryDoctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.create({
      ...tertiaryDoctorMedicalSpecialityMappingCreationAttributes,
      isPrimaryMedicalSpeciality: false,
      isSecondaryMedicalSpeciality: false,
      isTertiaryMedicalSpeciality: true,
    });
  }

  public async getPrimaryDoctorMedicalSpecialityMapping(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return (
      await this._drizzle
        .select({
          userId: doctorMedicalSpecialityMappingTable.userId,
          medicalSpecialityId:
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
        })
        .from(doctorMedicalSpecialityMappingTable)
        .where(
          and(
            eq(doctorMedicalSpecialityMappingTable.userId, doctorId),
            eq(
              doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
              true
            )
          )
        )
    )[0];
  }

  public async getSecondaryDoctorMedicalSpecialityMapping(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return (
      await this._drizzle
        .select({
          userId: doctorMedicalSpecialityMappingTable.userId,
          medicalSpecialityId:
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
        })
        .from(doctorMedicalSpecialityMappingTable)
        .where(
          and(
            eq(doctorMedicalSpecialityMappingTable.userId, doctorId),
            eq(
              doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
              true
            )
          )
        )
    )[0];
  }

  public async getTertiaryDoctorMedicalSpecialityMapping(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return (
      await this._drizzle
        .select({
          userId: doctorMedicalSpecialityMappingTable.userId,
          medicalSpecialityId:
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
        })
        .from(doctorMedicalSpecialityMappingTable)
        .where(
          and(
            eq(doctorMedicalSpecialityMappingTable.userId, doctorId),
            eq(
              doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
              true
            )
          )
        )
    )[0];
  }

  public async deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(
    doctorId: string,
    medicalSpecialityId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return (
      await this._drizzle
        .delete(doctorMedicalSpecialityMappingTable)
        .where(
          and(
            eq(doctorMedicalSpecialityMappingTable.userId, doctorId),
            eq(
              doctorMedicalSpecialityMappingTable.medicalSpecialityId,
              medicalSpecialityId
            )
          )
        )
        .returning({
          userId: doctorMedicalSpecialityMappingTable.userId,
          medicalSpecialityId:
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
        })
    )[0];
  }

  public async updateMedicalDoctorSpecialityMapping(
    doctorId: string,
    currentMedicalSpecialityId: string,
    newMedicalSpecialityId: string,
    isPrimaryMedicalSpeciality: boolean,
    isSecondaryMedicalSpeciality: boolean,
    isTertiaryMedicalSpeciality: boolean
  ): Promise<DoctorMedicalSpecialityMapping | null> {
    return (
      await this._drizzle
        .update(doctorMedicalSpecialityMappingTable)
        .set({
          medicalSpecialityId: newMedicalSpecialityId,
          isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality,
        })
        .where(
          and(
            eq(doctorMedicalSpecialityMappingTable.userId, doctorId),
            eq(
              doctorMedicalSpecialityMappingTable.medicalSpecialityId,
              currentMedicalSpecialityId
            )
          )
        )
        .returning({
          medicalSpecialityId:
            doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          userId: doctorMedicalSpecialityMappingTable.userId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
        })
    )[0];
  }

  public async deleteDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<string | undefined> {
    return await this.delete(doctorId);
    // console.log(await this.delete(doctorId));

    // await this.delete(doctorId)
  }
}
