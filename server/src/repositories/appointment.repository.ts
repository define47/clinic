import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Appointment,
  AppointmentCreationAttributes,
} from "../models/appointment.model";
import { IAppointmentRepository } from "./appointment.irepository";
import { BaseRepository } from "./base.repository";
import { Table } from "drizzle-orm";

export class AppointmentRepository
  extends BaseRepository<Appointment>
  implements IAppointmentRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined> {
    return await this.create(appointmentCreationAttributes);
  }
}
