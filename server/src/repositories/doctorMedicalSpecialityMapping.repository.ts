import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  DoctorMedicalSpecialityMapping,
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes,
  DoctorMedicalSpecialityMappingUpdateAttributes,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
import { BaseRepository } from "./base.repository";
import { IDoctorSpecialityMappingRepository } from "./doctorMedicalSpecialityMapping.irepository";
import { Table, and, count, eq } from "drizzle-orm";
import {
  MedicalSpeciality,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";
import { PgColumn } from "drizzle-orm/pg-core";

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

  public async getDoctorMedicalSpecialityMappingByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.getById(doctorMedicalSpecialityMappingId);
  }

  public async getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId: string
  ): Promise<DoctorMedicalSpecialityMapping[] | undefined> {
    return this._drizzle
      .select()
      .from(doctorMedicalSpecialityMappingTable)
      .where(eq(doctorMedicalSpecialityMappingTable.userId, doctorId));
  }

  public async getDoctorMedicalSpecialityMappingsCountByMedicalSpeciality() {
    const originalData = await this._drizzle
      .select({
        totalCount: count(),
        medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
        isPrimaryMedicalSpeciality:
          doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
        isSecondaryMedicalSpeciality:
          doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
        isTertiaryMedicalSpeciality:
          doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
      })
      .from(doctorMedicalSpecialityMappingTable)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          doctorMedicalSpecialityMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .groupBy(
        medicalSpecialityTable.medicalSpecialityId,
        doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
        doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
        doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality
      )
      .orderBy(medicalSpecialityTable.medicalSpecialityName);

    const transformedData = {};

    // Process each entry in the original data
    originalData.forEach((entry) => {
      const {
        medicalSpecialityName,
        isPrimaryMedicalSpeciality,
        isSecondaryMedicalSpeciality,
        isTertiaryMedicalSpeciality,
        totalCount,
      } = entry;

      // Check if the medical speciality exists in the transformed data object
      if (!transformedData[medicalSpecialityName]) {
        // If not, initialize the entry with default values
        transformedData[medicalSpecialityName] = {
          medicalSpecialityName,
          primary: 0,
          secondary: 0,
          tertiary: 0,
        };
      }

      // Update the counts in the transformed data object
      transformedData[medicalSpecialityName].primary +=
        isPrimaryMedicalSpeciality ? totalCount : 0;
      transformedData[medicalSpecialityName].secondary +=
        isSecondaryMedicalSpeciality ? totalCount : 0;
      transformedData[medicalSpecialityName].tertiary +=
        isTertiaryMedicalSpeciality ? totalCount : 0;
    });

    // Convert the object values to an array
    const finalTransformedData = Object.values(transformedData);

    return finalTransformedData;
  }

  public async createDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingCreationAttributes: DoctorMedicalSpecialityMappingCreationAttributes
  ): Promise<DoctorMedicalSpecialityMapping | undefined> {
    return await this.create(doctorMedicalSpecialityMappingCreationAttributes);
  }

  public async deleteDoctorMedicalSpecialityMappingByMappingId(
    doctorMedicalSpecialityMappingId: string
  ): Promise<string | undefined> {
    return await this.delete(doctorMedicalSpecialityMappingId);
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
          doctorMedicalSpecialityMappingId:
            doctorMedicalSpecialityMappingTable.doctorMedicalSpecialityMappingId,
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

  public async updateDoctorMedicalSpecialityMapping(
    doctorMedicalSpecialityMappingId: string,
    doctorMedicalSpecialityMappingUpdateAttributes: DoctorMedicalSpecialityMappingUpdateAttributes
  ): Promise<DoctorMedicalSpecialityMapping | null> {
    return (
      await this._drizzle
        .update(doctorMedicalSpecialityMappingTable)
        .set({
          medicalSpecialityId:
            doctorMedicalSpecialityMappingUpdateAttributes.medicalSpecialityId,
          isPrimaryMedicalSpeciality:
            doctorMedicalSpecialityMappingUpdateAttributes.isPrimaryMedicalSpeciality,
          isSecondaryMedicalSpeciality:
            doctorMedicalSpecialityMappingUpdateAttributes.isSecondaryMedicalSpeciality,
          isTertiaryMedicalSpeciality:
            doctorMedicalSpecialityMappingUpdateAttributes.isTertiaryMedicalSpeciality,
        })
        .where(
          eq(
            doctorMedicalSpecialityMappingTable.doctorMedicalSpecialityMappingId,
            doctorMedicalSpecialityMappingId
          )
        )
        .returning({
          doctorMedicalSpecialityMappingId:
            doctorMedicalSpecialityMappingTable.doctorMedicalSpecialityMappingId,
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
}
