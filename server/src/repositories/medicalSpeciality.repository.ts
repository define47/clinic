import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpeciality,
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
  medicalSpecialityTable,
} from "../models/medicalSpeciality.model";
import { BaseRepository } from "./base.repository";
import { IMedicalSpecialityRepository } from "./medicalSpeciality.irepository";
import { Table, asc, count, desc, ilike } from "drizzle-orm";

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

  public async getMedicalSpecialityCount(): Promise<number | undefined> {
    try {
      return (
        await this._drizzle.select({ totalCount: count() }).from(this._table)
      )[0].totalCount;
    } catch (error) {
      console.log(error);
    }
  }

  public async getMedicalSpecialityById(
    medicalSpecialityId: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getById(medicalSpecialityId);
  }

  public async getMedicalSpecialityByName(
    medicalSpecialityName: string
  ): Promise<MedicalSpeciality | undefined> {
    return await this.getByAttribute(
      "medicalSpecialityName",
      medicalSpecialityName
    );
  }

  public async getAllMedicalSpecialities(
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        tableData: MedicalSpeciality[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    const condition = {
      medicalSpecialitySearchQuery: ilike(
        medicalSpecialityTable.medicalSpecialityName,
        `${searchQuery}%`
      ),
    };

    const totalCount = await this._drizzle
      .select({ totalCount: count() })
      .from(this._table)
      .where(condition.medicalSpecialitySearchQuery);

    const offset = page * limit;

    let orderByIndicator = asc(medicalSpecialityTable.medicalSpecialityName);

    let orderByDirection = orderBy.split(":")[0];
    let orderByColumn = orderBy.split(":")[1];

    if (orderByDirection === "asc")
      orderByIndicator = asc(medicalSpecialityTable.medicalSpecialityName);
    else if (orderByDirection === "desc")
      orderByIndicator = desc(medicalSpecialityTable.medicalSpecialityName);

    const medicalSpecialities = await this._drizzle
      .select({
        medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
        medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
      })
      .from(this._table)
      .where(condition.medicalSpecialitySearchQuery)
      .limit(limit)
      .offset(offset)
      .orderBy(orderByIndicator);

    return {
      tableData: medicalSpecialities,
      totalCount: totalCount[0].totalCount,
      totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
    };
  }

  public async createMedicalSpeciality(
    medicalSpecialityCreationAttributes: MedicalSpecialityCreationAttributes
  ): Promise<MedicalSpeciality | undefined> {
    return await this.create(medicalSpecialityCreationAttributes);
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
    medicalSpecialityId: string
  ): Promise<string | undefined> {
    return await this.delete(medicalSpecialityId);
  }
}
