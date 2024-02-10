import {
  AppointmentCreationAttributes,
  Appointment,
  appointmentTable,
  AppointmentUpdateAttributes,
  AppointmentJoinDoctorAndPatient,
} from "../models/appointment.model";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IAppointmentService } from "./appointment.iservice";

export class AppointmentService implements IAppointmentService {
  private readonly _appointmentRepository: AppointmentRepository;

  public constructor() {
    this._appointmentRepository = new AppointmentRepository(
      drizzleInstance,
      appointmentTable
    );
  }

  public async getAppointmentCountByPeriod(
    period: string
  ): Promise<number | undefined> {
    return this._appointmentRepository.getAppointmentCountByPeriod(period);
  }

  public async getAppointmentJoinDoctorAndPatient(appointmentId: string) {
    return await this._appointmentRepository.getAppointmentJoinDoctorAndPatient(
      appointmentId
    );
  }

  public async getAllAppointments(
    table: string,
    searchBy: string[],
    searchQuery: string,
    scheduleFilter: string,
    customStartDate: string,
    customEndDate: string,
    orderBy: string[],
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
    return await this._appointmentRepository.getAllAppointments(
      table,
      searchBy,
      searchQuery,
      scheduleFilter,
      customStartDate,
      customEndDate,
      orderBy,
      limit,
      page,
      doctorId,
      patientId
    );
  }

  public async createAppointment(
    appointmentCreationAttributes: AppointmentCreationAttributes
  ): Promise<Appointment | undefined> {
    return await this._appointmentRepository.createAppointment(
      appointmentCreationAttributes
    );
  }

  public async updateAppointment(
    appointmentId: string,
    appointmentUpdateAttributes: AppointmentUpdateAttributes
  ): Promise<Appointment | undefined> {
    return this._appointmentRepository.updateAppointment(
      appointmentId,
      appointmentUpdateAttributes
    );
  }

  public async deleteAppointment(
    appointmentId: string
  ): Promise<string | undefined> {
    return this._appointmentRepository.deleteAppointment(appointmentId);
  }

  public async getDoctorAppointmentBookedSlots(doctorId: string, date: string) {
    return this._appointmentRepository.getDoctorAppointmentBookedSlots(
      doctorId,
      date
    );
  }
}
