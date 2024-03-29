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

  public async getAppointmentInfoByPeriod(
    choice: string,
    period: string,
    doctorId: string,
    appointmentStatus: string
  ): Promise<any> {
    return this._appointmentRepository.getAppointmentInfoByPeriod(
      choice,
      period,
      doctorId,
      appointmentStatus
    );
  }

  public async getAppointmentById(appointmentId: string) {
    return await this._appointmentRepository.getAppointmentById(appointmentId);
  }

  public async getAppointmentByIdJoinDoctorAndPatient(appointmentId: string) {
    return await this._appointmentRepository.getAppointmentByIdJoinDoctorAndPatient(
      appointmentId
    );
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
    return await this._appointmentRepository.getAllAppointments(
      searchInTable,
      orderInTable,
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

  public async getAppointmentCountByPeriodAndStatus(
    period: string,
    appointmentStatus: string
  ): Promise<any> {
    return await this._appointmentRepository.getAppointmentCountByPeriodAndStatus(
      period,
      appointmentStatus
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

  public async hasDoctorAppointments(doctorId: string) {
    return await this._appointmentRepository.hasDoctorAppointments(doctorId);
  }

  public async getDoctorAppointmentBookedSlots(doctorId: string, date: string) {
    return this._appointmentRepository.getDoctorAppointmentBookedSlots(
      doctorId,
      date
    );
  }
}
