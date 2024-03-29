import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  MedicalSpecialityMedicalProcedureMapping,
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
  medicalSpecialityMedicalProcedureMappingTable,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import { BaseRepository } from "./base.repository";
import { IMedicalSpecialityMedicalProcedureMappingRepository } from "./medicalSpecialityMedicalProcedureMapping.irepository";
import { Table, and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { medicalSpecialityTable } from "../models/medicalSpeciality.model";
import {
  MedicalProcedure,
  medicalProcedureTable,
} from "../models/medicalProcedure.model";

export class MedicalSpecialityMedicalProcedureMappingRepository
  extends BaseRepository<MedicalSpecialityMedicalProcedureMapping>
  implements IMedicalSpecialityMedicalProcedureMappingRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getAllMedicalSpecialitiesAndProcedures() {
    const data = await this._drizzle
      .select({
        medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
        medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
        procedureId: medicalProcedureTable.medicalProcedureId,
        procedureName: medicalProcedureTable.medicalProcedureName,
      })
      .from(this._table)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .innerJoin(
        medicalProcedureTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
          medicalProcedureTable.medicalProcedureId
        )
      );

    return data;
  }

  public async getAllMedicalProceduresByMedicalSpeciality(
    medicalSpecialityId: string,
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        tableData: MedicalProcedure[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    let orderByFinalColumn = asc(medicalProcedureTable.medicalProcedureName);
    const orderDirection = orderBy.split(":")[0];
    const orderColumn = orderBy.split(":")[1];

    if (orderDirection === "asc" && orderColumn.length > 2) {
      orderByFinalColumn = asc(
        medicalProcedureTable[orderColumn as keyof MedicalProcedure]
      );
    } else if (orderDirection === "desc" && orderColumn.length > 2) {
      orderByFinalColumn = desc(
        medicalProcedureTable[orderColumn as keyof MedicalProcedure]
      );
    }

    // if (orderBy === "asc:medicalProcedureName")
    //   orderByFinalColumn = asc(medicalProcedureTable.medicalProcedureName);
    // else if (orderBy === "desc:medicalProcedureName")
    //   orderByFinalColumn = desc(medicalProcedureTable.medicalProcedureName);
    // else if (orderBy === "asc:medicalProcedurePrice")
    //   orderByFinalColumn = asc(medicalProcedureTable.medicalProcedurePrice);
    // else if (orderBy === "desc:medicalProcedurePrice")
    //   orderByFinalColumn = desc(medicalProcedureTable.medicalProcedurePrice);

    const medicalProcedureSearchQuery = {
      condition: and(
        ilike(medicalProcedureTable.medicalProcedureName, `${searchQuery}%`),
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityId)
      ),
    };

    const totalCount = await this._drizzle
      .select({
        totalCount: count(),
      })
      .from(this._table)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .innerJoin(
        medicalProcedureTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
          medicalProcedureTable.medicalProcedureId
        )
      )
      .where(medicalProcedureSearchQuery.condition);

    console.log(totalCount);

    let offset = page * limit;

    const data = await this._drizzle
      .select({
        // medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
        // medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
        medicalProcedureId: medicalProcedureTable.medicalProcedureId,
        medicalProcedureName: medicalProcedureTable.medicalProcedureName,
        medicalProcedurePrice: medicalProcedureTable.medicalProcedurePrice,
      })
      .from(this._table)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .innerJoin(
        medicalProcedureTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
          medicalProcedureTable.medicalProcedureId
        )
      )
      .where(medicalProcedureSearchQuery.condition)
      .limit(limit)
      .offset(offset)
      .orderBy(orderByFinalColumn!);

    return {
      tableData: data,
      totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
      totalCount: totalCount[0].totalCount,
    };
  }

  public async getMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getAllMedicalProceduresByMedicalSpecialities(
    medicalSpecialityIds: string[]
  ) {
    console.log(medicalSpecialityIds[0]);

    const condition = {
      oneMedicalSpecialityIds: eq(
        medicalSpecialityTable.medicalSpecialityId,
        medicalSpecialityIds[0]
      ),
      twoMedicalSpecialityIds: or(
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityIds[0]),
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityIds[1])
      ),
      threeMedicalSpecialityIds: or(
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityIds[0]),
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityIds[1]),
        eq(medicalSpecialityTable.medicalSpecialityId, medicalSpecialityIds[2])
      ),
    };

    let cond;
    if (medicalSpecialityIds.length === 1)
      cond = condition.oneMedicalSpecialityIds;
    else if (medicalSpecialityIds.length === 2)
      cond = condition.twoMedicalSpecialityIds;
    else if (medicalSpecialityIds.length === 3)
      cond = condition.threeMedicalSpecialityIds;

    const data = await this._drizzle
      .select({
        // medicalSpecialityName: medicalSpecialityTable.medicalSpecialityName,
        medicalSpecialityId: medicalSpecialityTable.medicalSpecialityId,
        medicalProcedureId: medicalProcedureTable.medicalProcedureId,
        medicalProcedureName: medicalProcedureTable.medicalProcedureName,
        medicalProcedurePrice: medicalProcedureTable.medicalProcedurePrice,
      })
      .from(this._table)
      .innerJoin(
        medicalSpecialityTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalSpecialityTable.medicalSpecialityId
        )
      )
      .innerJoin(
        medicalProcedureTable,
        eq(
          medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
          medicalProcedureTable.medicalProcedureId
        )
      )
      .where(cond);

    return data;
  }

  public async createMedicalSpecialityMedicalProcedureMapping(
    medicalSpecialityMedicalProcedureMappingCreationAttributes: MedicalSpecialityMedicalProcedureMappingCreationAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    return await this.create(
      medicalSpecialityMedicalProcedureMappingCreationAttributes
    );
  }

  public async updateMedicalSpecialityMedicalProcedureMapping(
    currentSpecialityId: string,
    newSPecialityId: string,
    medicalSpecialityMedicalProcedureMappingUpdateAttributes: MedicalSpecialityMedicalProcedureMappingUpdateAttributes
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    throw new Error("Method not implemented.");
  }

  public async deleteMedicalSpecialityMedicalProcedureMappingsBySpecialityId(
    medicalSpecialityId: string
  ): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }

  public async deleteMedicalSpecialityMedicalProcedureMappingBySpecialityIdAndProcedureId(
    medicalSpecialityId: string,
    medicalProcedureId: string
  ): Promise<MedicalSpecialityMedicalProcedureMapping | undefined> {
    return (
      await this._drizzle
        .delete(medicalSpecialityMedicalProcedureMappingTable)
        .where(
          and(
            eq(
              medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
              medicalSpecialityId
            ),
            eq(
              medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
              medicalProcedureId
            )
          )
        )
        .returning({
          medicalSpecialityId:
            medicalSpecialityMedicalProcedureMappingTable.medicalSpecialityId,
          medicalProcedureId:
            medicalSpecialityMedicalProcedureMappingTable.medicalProcedureId,
        })
    )[0];
  }
}
