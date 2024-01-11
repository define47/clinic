import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  AppointmentHistoryCreationAttributes,
  AppointmentHistory,
  appointmentHistoryTable,
} from "../models/appointmentHistory.model";
import { IAppointmentHistoryRepository } from "./appointmentHistory.irepository";
import { BaseRepository } from "./base.repository";
import { Table, eq } from "drizzle-orm";

export class AppointmentHistoryRepository
  extends BaseRepository<AppointmentHistory>
  implements IAppointmentHistoryRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistory[] | undefined> {
    return await this._drizzle
      .select()
      .from(appointmentHistoryTable)
      .where(eq(appointmentHistoryTable.appointmentId, appointmentId));
  }
  public async createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined> {
    return await this.create(appointmentHistoryCreationAttributes);
  }

  public async deleteAppointmentHistory(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this.delete(appointmentId);
  }
}
