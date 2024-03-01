import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  Appointment,
  AppointmentCreationAttributes,
  AppointmentJoinDoctorAndPatient,
  AppointmentStatusEnum,
  AppointmentUpdateAttributes,
  appointmentTable,
} from "../models/appointment.model";
import { IAppointmentRepository } from "./appointment.irepository";
import { BaseRepository } from "./base.repository";
import {
  SQL,
  Table,
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  ilike,
  lte,
  sql,
} from "drizzle-orm";
import { User, userTable } from "../models/user.model";
import { PgColumn, alias } from "drizzle-orm/pg-core";
import { getTimeFrame } from "../utils/utils";

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

  public async getAppointmentInfoByPeriod(
    choice: string,
    period: string,
    doctorId: string,
    appointmentStatus: string
  ): Promise<any> {
    try {
      const currentDate = new Date();
      let startDate, endDate;

      switch (period) {
        case "today":
          const currentDayStartInUTC = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate(),
              0,
              0,
              0
            )
          );
          const currentDayEndInUTC = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate(),
              23,
              59,
              59,
              999
            )
          );

          console.log("current day start:", currentDayStartInUTC);
          console.log("current day end:", currentDayEndInUTC);

          startDate = currentDayStartInUTC;
          endDate = currentDayEndInUTC;
          break;
        case "week":
          const firstDayOfCurrentWeek = this.getFirstDayOfWeek(new Date());
          firstDayOfCurrentWeek.setUTCHours(0, 0, 0, 0);
          const lastDayOfCurrentWeek = new Date(firstDayOfCurrentWeek);
          lastDayOfCurrentWeek.setUTCHours(23, 59, 59, 999);
          lastDayOfCurrentWeek.setDate(lastDayOfCurrentWeek.getDate() + 6);

          console.log("first day of current week:", firstDayOfCurrentWeek);
          console.log("last day of current week:", lastDayOfCurrentWeek);

          startDate = firstDayOfCurrentWeek;
          endDate = lastDayOfCurrentWeek;
          break;
        case "month":
          const currentMonthStart = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              1,
              0,
              0,
              0,
              0
            )
          );
          const currentMonthEnd = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth() + 1,
              0,
              23,
              59,
              59,
              999
            )
          );

          console.log("current month start:", currentMonthStart);
          console.log("current month end:", currentMonthEnd);

          startDate = currentMonthStart;
          endDate = currentMonthEnd;
          break;
        case "nextWeek":
          let startOfNextWeek = new Date(currentDate);
          let daysUntilNextMonday = (8 - currentDate.getUTCDay()) % 7;
          startOfNextWeek.setUTCDate(
            currentDate.getUTCDate() + daysUntilNextMonday
          );
          startOfNextWeek.setUTCHours(0, 0, 0, 0);

          let endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 6);
          endOfNextWeek.setUTCHours(23, 59, 59, 999);

          console.log("Start of next week (UTC):", startOfNextWeek);
          console.log("End of next week (UTC):", endOfNextWeek);

          startDate = startOfNextWeek;
          endDate = endOfNextWeek;
          break;
        default:
          break;
      }

      const appointmentStatuses = AppointmentStatusEnum.enumValues;
      let appointmentStatusIndex: number;
      switch (appointmentStatus) {
        case "scheduled":
          appointmentStatusIndex = 0;
          break;
        case "rescheduled":
          appointmentStatusIndex = 1;
        default:
          appointmentStatusIndex = -1;
          break;
      }

      const generalDataAppointmentCondition = {
        generalCondition: and(
          gte(appointmentTable.appointmentDateTime, startDate!),
          lte(appointmentTable.appointmentDateTime, endDate!)
          // eq(
          //   appointmentTable.appointmentStatus,
          //   AppointmentStatusEnum.enumValues[appointmentStatusIndex]
          // )
        ),
        doctorCondition: and(
          gte(appointmentTable.appointmentDateTime, startDate!),
          lte(appointmentTable.appointmentDateTime, endDate!),
          // eq(
          //   appointmentTable.appointmentStatus,
          //   AppointmentStatusEnum.enumValues[appointmentStatusIndex]
          // ),
          eq(appointmentTable.appointmentDoctorId, doctorId)
        ),
      };

      let cond;
      if (doctorId) cond = generalDataAppointmentCondition.doctorCondition;
      else cond = generalDataAppointmentCondition.generalCondition;

      const doctor = alias(userTable, "doctor");
      const patient = alias(userTable, "patient");

      // const data = await this._drizzle
      //   .select({
      //     doctorId: doctor.userId,
      //     doctorForename: doctor.userForename,
      //     doctorSurname: doctor.userSurname,
      //     appointmentCount: sql<number>`COUNT(${appointmentTable.appointmentDoctorId})`,
      //   })
      //   .from(appointmentTable)
      //   .innerJoin(
      //     doctor,
      //     eq(appointmentTable.appointmentDoctorId, doctor.userId)
      //   )
      //   .where(generalDataAppointmentCondition.condition)
      //   .groupBy(doctor.userId);

      // const data = await this._drizzle
      //   .select({
      //     doctorId: doctor.userId,
      //     doctorForename: doctor.userForename,
      //     doctorSurname: doctor.userSurname,
      //     appointmentDateTime: sql`DATE(${appointmentTable.appointmentDateTime})`,
      //     appointmentStatus: appointmentTable.appointmentStatus,
      //     appointmentCount: sql<number>`COUNT(${appointmentTable.appointmentDoctorId})`,
      //   })
      //   .from(appointmentTable)
      //   .innerJoin(
      //     doctor,
      //     eq(appointmentTable.appointmentDoctorId, doctor.userId)
      //   )
      //   .where(generalDataAppointmentCondition.condition)
      //   .groupBy(
      //     doctor.userId,
      //     sql`DATE(${appointmentTable.appointmentDateTime})`,
      //     appointmentTable.appointmentStatus
      //   );

      // const data = await this._drizzle
      //   .select({
      //     doctorId: doctor.userId,
      //     doctorForename: doctor.userForename,
      //     doctorSurname: doctor.userSurname,
      //     appointmentDateTime: sql`DATE(${appointmentTable.appointmentDateTime})`,
      //     // appointmentStatus: appointmentTable.appointmentStatus,
      //     appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
      //   })
      //   .from(appointmentTable)
      //   .innerJoin(
      //     doctor,
      //     eq(appointmentTable.appointmentDoctorId, doctor.userId)
      //   )
      //   .where(generalDataAppointmentCondition.condition)
      //   .groupBy(
      //     doctor.userId,
      //     // appointmentTable.appointmentStatus,
      //     sql`DATE(${appointmentTable.appointmentDateTime})`
      //   );
      // const data = await this._drizzle
      //   .select({
      //     // doctorId: doctor.userId,
      //     // doctorForename: doctor.userForename,
      //     // doctorSurname: doctor.userSurname,
      //     appointmentDateTime: sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`,

      //     // appointmentStatus: appointmentTable.appointmentStatus,
      //     appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
      //   })
      //   .from(appointmentTable)
      //   .innerJoin(
      //     doctor,
      //     eq(appointmentTable.appointmentDoctorId, doctor.userId)
      //   )
      //   .where(cond)
      //   .groupBy(
      //     // doctor.userId,
      //     // appointmentTable.appointmentStatus,
      //     sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`
      //   );

      let data;
      // data = await this._drizzle
      //   .select({
      //     // doctorId: doctor.userId,
      //     // doctorForename: doctor.userForename,
      //     // doctorSurname: doctor.userSurname,
      //     appointmentDateTime: sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`,

      //     // appointmentStatus: appointmentTable.appointmentStatus,
      //     appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
      //   })
      //   .from(appointmentTable)
      //   .innerJoin(
      //     doctor,
      //     eq(appointmentTable.appointmentDoctorId, doctor.userId)
      //   )
      //   .where(cond)
      //   .groupBy(
      //     // doctor.userId,
      //     // appointmentTable.appointmentStatus,
      //     sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`
      //   );

      if (choice === "getTotalNumberOfAppointmentsPerPeriod") {
        data = await this._drizzle
          .select({
            appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
          })
          .from(appointmentTable)
          .innerJoin(
            doctor,
            eq(appointmentTable.appointmentDoctorId, doctor.userId)
          )
          .where(cond);
      } else if (
        choice === "getTotalNumberOfDoctorsPerPeriodWithAppointments"
      ) {
        data = await this._drizzle
          .select({
            appointmentCount: countDistinct(
              appointmentTable.appointmentDoctorId
            ),
          })
          .from(appointmentTable)
          .innerJoin(
            doctor,
            eq(appointmentTable.appointmentDoctorId, doctor.userId)
          )
          .where(cond);
      } else if (
        choice === "getTotalNumberOfPatientsPerPeriodWithAppointments"
      ) {
        data = await this._drizzle
          .select({
            appointmentCount: countDistinct(
              appointmentTable.appointmentPatientId
            ),
          })
          .from(appointmentTable)
          .where(cond);
      } else if (
        choice === "getTotalNumberOfAppointmentsPerPeriodPerEachDate"
      ) {
        data = await this._drizzle
          .select({
            // doctorId: doctor.userId,
            // doctorForename: doctor.userForename,
            // doctorSurname: doctor.userSurname,
            appointmentDateTime: sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`,

            // appointmentStatus: appointmentTable.appointmentStatus,
            appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
          })
          .from(appointmentTable)
          .innerJoin(
            doctor,
            eq(appointmentTable.appointmentDoctorId, doctor.userId)
          )
          .where(cond)
          .groupBy(
            // doctor.userId,
            // appointmentTable.appointmentStatus,
            sql`TO_CHAR(${appointmentTable.appointmentDateTime}, 'DD-MM-YYYY')`
          );
      }

      return data;
    } catch (error) {}
  }

  public async getAppointmentCountByPeriodAndStatus(
    period: string,
    appointmentStatus: string
  ): Promise<any> {
    const timeFrame = getTimeFrame(period);
    const data = await this._drizzle
      .select({
        appointmentCount: sql<number>`COUNT(${sql`DATE(${appointmentTable.appointmentDateTime})`})`,
      })
      .from(appointmentTable)
      .where(
        and(
          gte(appointmentTable.appointmentDateTime, timeFrame.startDate!),
          lte(appointmentTable.appointmentDateTime, timeFrame.endDate!),
          eq(appointmentTable.appointmentStatus, appointmentStatus)
        )
      );

    return data;
  }

  public async getAppointmentById(appointmentId: string): Promise<any> {
    return (
      await this._drizzle
        .select({
          appointmentId: appointmentTable.appointmentId,
          appointmentDoctorId: appointmentTable.appointmentDoctorId,
          appointmentPatientId: appointmentTable.appointmentPatientId,
          appointmentReason: appointmentTable.appointmentReason,
          appointmentDateTime: appointmentTable.appointmentDateTime,
          appointmentStatus: appointmentTable.appointmentStatus,
          appointmentCancellationReason:
            appointmentTable.appointmentCancellationReason,
        })
        .from(this._table)

        .where(eq(appointmentTable.appointmentId, appointmentId))
    )[0];
  }

  public async getAppointmentByIdJoinDoctorAndPatient(
    appointmentId: string
  ): Promise<AppointmentJoinDoctorAndPatient | undefined> {
    const doctor = alias(userTable, "doctor");
    const patient = alias(userTable, "patient");
    return (
      await this._drizzle
        .select({
          appointment: {
            appointmentId: appointmentTable.appointmentId,
            appointmentDoctorId: appointmentTable.appointmentDoctorId,
            appointmentPatientId: appointmentTable.appointmentPatientId,
            appointmentReason: appointmentTable.appointmentReason,
            appointmentDateTime: appointmentTable.appointmentDateTime,
            appointmentStatus: appointmentTable.appointmentStatus,
            appointmentCancellationReason:
              appointmentTable.appointmentCancellationReason,
            appointmentPrice: appointmentTable.appointmentPrice,
          },
          doctor: {
            doctorId: doctor.userId,
            doctorForename: doctor.userForename,
            doctorSurname: doctor.userSurname,
          },
          patient: {
            patientId: patient.userId,
            patientForename: patient.userForename,
            patientSurname: patient.userSurname,
            patientEmail: patient.userEmail,
          },
        })
        .from(this._table)
        .innerJoin(
          doctor,
          eq(appointmentTable.appointmentDoctorId, doctor.userId)
        )
        .innerJoin(
          patient,
          eq(appointmentTable.appointmentPatientId, patient.userId)
        )
        .where(eq(appointmentTable.appointmentId, appointmentId))
    )[0];
  }

  public getFirstDayOfWeek(d: any) {
    // 👇️ clone date object, so we don't mutate it
    const date = new Date(d);
    const day = date.getDay(); // 👉️ get day of week

    // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.setDate(diff));
  }

  public async getAllAppointments(
    searchInTable: string,
    orderInTable: string,
    searchBy: string[],
    searchQuery: string,
    scheduleFilter: string,
    customStartDate: string,
    customEndDate: string,
    orderBy: string,
    limit: number,
    page: number,
    doctorId?: string,
    patientId?: string
  ): Promise<
    | {
        tableData: AppointmentJoinDoctorAndPatient[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    try {
      // let filterBasedOnTable;
      const doctor = alias(userTable, "doctor");
      const patient = alias(userTable, "patient");
      const currentDate = new Date();
      let startDate, endDate;

      // switch (table) {
      //   case "doctor":
      //     filterBasedOnTable = doctor;
      //     break;
      //   case "patient":
      //     filterBasedOnTable = patient;
      //   case "appointment":
      //     filterBasedOnTable = appointmentTable;
      //   default:
      //     break;
      // }

      switch (scheduleFilter) {
        case "today":
          const currentDayStartInUTC = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate(),
              0,
              0,
              0
            )
          );
          const currentDayEndInUTC = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate(),
              23,
              59,
              59,
              999
            )
          );

          // console.log("current day start:", currentDayStartInUTC);
          // console.log("current day end:", currentDayEndInUTC);

          startDate = currentDayStartInUTC;
          endDate = currentDayEndInUTC;
          break;
        case "week":
          const firstDayOfCurrentWeek = this.getFirstDayOfWeek(new Date());
          firstDayOfCurrentWeek.setUTCHours(0, 0, 0, 0);
          const lastDayOfCurrentWeek = new Date(firstDayOfCurrentWeek);
          lastDayOfCurrentWeek.setUTCHours(23, 59, 59, 999);
          lastDayOfCurrentWeek.setDate(lastDayOfCurrentWeek.getDate() + 6);

          // console.log("first day of current week:", firstDayOfCurrentWeek);
          // console.log("last day of current week:", lastDayOfCurrentWeek);

          startDate = firstDayOfCurrentWeek;
          endDate = lastDayOfCurrentWeek;
          break;
        case "month":
          const currentMonthStart = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              1,
              0,
              0,
              0,
              0
            )
          );
          const currentMonthEnd = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth() + 1,
              0,
              23,
              59,
              59,
              999
            )
          );

          // console.log("current month start:", currentMonthStart);
          // console.log("current month end:", currentMonthEnd);

          startDate = currentMonthStart;
          endDate = currentMonthEnd;
          break;
        case "nextWeek":
          let startOfNextWeek = new Date(currentDate);
          let daysUntilNextMonday = (8 - currentDate.getUTCDay()) % 7;
          startOfNextWeek.setUTCDate(
            currentDate.getUTCDate() + daysUntilNextMonday
          );
          startOfNextWeek.setUTCHours(0, 0, 0, 0);

          let endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 6);
          endOfNextWeek.setUTCHours(23, 59, 59, 999);

          console.log("Start of next week (UTC):", startOfNextWeek);
          console.log("End of next week (UTC):", endOfNextWeek);

          startDate = startOfNextWeek;
          endDate = endOfNextWeek;
          break;
        case "custom":
          // console.log("customStartDate", customStartDate);

          startDate = new Date(customStartDate);
          startDate.setUTCHours(0, 0, 0);
          endDate = new Date(customEndDate);
          endDate.setUTCHours(23, 59, 59);
          break;
        default:
          break;
      }

      let columnToSearchBy1: PgColumn<any>;
      let columnToSearchBy2: PgColumn<any>;
      let columnToOrderBy1: PgColumn<any>;
      let sortDirectionColumnToOrderBy1;
      columnToSearchBy1 = userTable.userForename;
      columnToSearchBy2 = userTable.userForename;
      columnToOrderBy1 = userTable.userForename;

      if (searchBy.length === 1 && searchInTable === "doctor") {
        if (searchBy[0] === "userForename")
          columnToSearchBy1 = doctor.userForename;
        else if (searchBy[0] === "userSurname")
          columnToSearchBy1 = doctor.userSurname;
      } else if (searchBy.length === 2 && searchInTable === "doctor") {
        if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
          columnToSearchBy1 = doctor.userForename;
          columnToSearchBy2 = doctor.userSurname;
        } else if (
          searchBy[0] === "userSurname" &&
          searchBy[1] === "userForename"
        ) {
          columnToSearchBy1 = doctor.userSurname;
          columnToSearchBy2 = doctor.userForename;
        }
      }

      if (searchBy.length === 1 && searchInTable === "patient") {
        if (searchBy[0] === "userForename")
          columnToSearchBy1 = patient.userForename;
        else if (searchBy[0] === "userSurname")
          columnToSearchBy1 = patient.userSurname;
      } else if (searchBy.length === 2 && searchInTable === "patient") {
        if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
          columnToSearchBy1 = patient.userForename;
          columnToSearchBy2 = patient.userSurname;
        } else if (
          searchBy[0] === "userSurname" &&
          searchBy[1] === "userForename"
        ) {
          columnToSearchBy1 = patient.userSurname;
          columnToSearchBy2 = patient.userForename;
        }
      }

      // let orderByFinal0;
      // let orderByFinal1;
      // const orderByColumns: SQL<unknown>[] = [];
      // if (orderBy.length === 1 && table === "doctor") {
      //   const element0 = orderBy[0].split(":");

      //   if (element0[0] === "asc") {
      //     orderByFinal0 = asc(doctor[element0[1] as keyof User]);

      //     orderByColumns.push(orderByFinal0);
      //   } else {
      //     orderByFinal0 = desc(doctor[element0[1] as keyof User]);
      //     orderByColumns.push(orderByFinal0!);
      //   }
      // } else if (orderBy.length === 2 && table === "doctor") {
      //   const element0 = orderBy[0].split(":");
      //   const element1 = orderBy[1].split(":");
      //   if (element0[0] === "asc") {
      //     orderByFinal0 = asc(doctor[element0[1] as keyof User]);
      //     orderByColumns.push(orderByFinal0!);
      //   } else {
      //     orderByFinal0 = desc(doctor[element0[1] as keyof User]);
      //     orderByColumns.push(orderByFinal0!);
      //   }

      //   if (element1[0] === "asc") {
      //     orderByFinal1 = asc(doctor[element1[1] as keyof User]);
      //     orderByColumns.push(orderByFinal1!);
      //   } else {
      //     orderByFinal1 = desc(doctor[element1[1] as keyof User]);
      //     orderByColumns.push(orderByFinal1!);
      //   }
      // }

      // if (orderBy.length === 1) {
      //   const element0 = orderBy[0].split(":");

      //   if (element0[0] === "asc") {
      //     orderByFinal0 = asc(
      //       appointmentTable[element0[1] as keyof Appointment]
      //     );

      //     orderByColumns.push(orderByFinal0);
      //   }
      // }

      let orderByColumn = asc(doctor.userForename);
      let sortOrder = orderBy.split(":")[0];
      let order = orderBy.split(":")[1];

      if (orderInTable === "doctor") {
        if (sortOrder === "asc")
          orderByColumn = asc(doctor[order as keyof User]);
        else if (sortOrder === "desc")
          orderByColumn = desc(doctor[order as keyof User]);
      } else if (orderInTable === "patient") {
        if (sortOrder === "asc")
          orderByColumn = asc(patient[order as keyof User]);
        else if (sortOrder === "desc")
          orderByColumn = desc(patient[order as keyof User]);
      } else if (orderInTable === "appointment") {
        if (sortOrder === "asc")
          orderByColumn = asc(appointmentTable[order as keyof Appointment]);
        else if (sortOrder === "desc")
          orderByColumn = desc(appointmentTable[order as keyof Appointment]);
      }
      const appointmentSearchQuery = {
        condition: and(
          gte(appointmentTable.appointmentDateTime, startDate!),
          lte(appointmentTable.appointmentDateTime, endDate!),
          searchBy.length === 1
            ? ilike(columnToSearchBy1, `${searchQuery}%`)
            : searchBy.length === 2
            ? sql`CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
            : sql`TRUE`,
          doctorId
            ? eq(doctor.userId, doctorId!)
            : patientId
            ? eq(patient.userId, patientId!)
            : sql`TRUE`
        ),
      };

      let offset = page * limit;

      const totalCount = await this._drizzle
        .select({ totalCount: count() })
        .from(appointmentTable)
        .innerJoin(
          doctor,
          eq(appointmentTable.appointmentDoctorId, doctor.userId)
        )
        .innerJoin(
          patient,
          eq(appointmentTable.appointmentPatientId, patient.userId)
        )
        .where(appointmentSearchQuery.condition);

      const data = await this._drizzle
        .select({
          appointment: {
            appointmentId: appointmentTable.appointmentId,
            appointmentDoctorId: appointmentTable.appointmentDoctorId,
            appointmentPatientId: appointmentTable.appointmentPatientId,
            appointmentReason: appointmentTable.appointmentReason,
            appointmentDateTime: appointmentTable.appointmentDateTime,
            appointmentStatus: appointmentTable.appointmentStatus,
            appointmentCancellationReason:
              appointmentTable.appointmentCancellationReason,
            appointmentPrice: appointmentTable.appointmentPrice,
          },
          doctor: {
            doctorId: doctor.userId,
            doctorForename: doctor.userForename,
            doctorSurname: doctor.userSurname,
          },
          patient: {
            patientId: patient.userId,
            patientForename: patient.userForename,
            patientSurname: patient.userSurname,
            patientEmail: patient.userEmail,
          },
        })
        .from(appointmentTable)
        .innerJoin(
          doctor,
          eq(appointmentTable.appointmentDoctorId, doctor.userId)
        )
        .innerJoin(
          patient,
          eq(appointmentTable.appointmentPatientId, patient.userId)
        )
        .where(appointmentSearchQuery.condition)
        // .orderBy(...orderByColumns)
        .orderBy(orderByColumn)
        .limit(limit)
        .offset(offset);

      // .where(ilike(patient.userForename, `${searchQuery}%`));

      return {
        tableData: data,
        totalCount: totalCount[0].totalCount,
        totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
      };
    } catch (error) {
      console.log(error);
    }
  }

  public async createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined> {
    return await this.create(appointmentCreationAttributes);
  }

  public async updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined> {
    return await this.update(appointmentId, appointmentUpdateAttributes);
  }

  public async deleteAppointment(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this.delete(appointmentId);
  }

  public async hasDoctorAppointments(doctorId: string) {
    const doctor = alias(userTable, "doctor");

    const data = await this._drizzle
      .select({
        doctorId: appointmentTable.appointmentDoctorId,
      })
      .from(appointmentTable)
      .innerJoin(doctor, eq(appointmentTable.appointmentDoctorId, doctorId))
      .limit(5);

    console.log("data");

    return data.length > 0;
  }

  public async getDoctorAppointmentBookedSlots(doctorId: string, date: string) {
    const doctor = alias(userTable, "doctor");
    const patient = alias(userTable, "patient");

    const startCustomDateFinal = new Date(date);
    startCustomDateFinal.setUTCHours(0, 0, 0);
    const endCustomDateFinal = new Date(date);
    endCustomDateFinal.setUTCHours(23, 59, 59);

    const data = await this._drizzle
      .select({
        appointmentId: appointmentTable.appointmentId,
        appointmentDateTime: appointmentTable.appointmentDateTime,
      })
      .from(appointmentTable)
      .innerJoin(
        doctor,
        eq(appointmentTable.appointmentDoctorId, doctor.userId)
      )
      .innerJoin(
        patient,
        eq(appointmentTable.appointmentPatientId, patient.userId)
      )
      .where(
        and(
          eq(doctor.userId, doctorId),
          gte(appointmentTable.appointmentDateTime, startCustomDateFinal),
          lte(appointmentTable.appointmentDateTime, endCustomDateFinal)
        )
      )
      .orderBy(asc(appointmentTable.appointmentDateTime));

    return data;
  }
}
