import {
  AppointmentCreationAttributes,
  Appointment,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";
import {
  AppointmentHistory,
  AppointmentHistoryCreationAttributes,
  AppointmentHistoryInnerJoinPatientAndDoctorAndUser,
  appointmentHistoryTable,
} from "../models/appointmentHistory.model";
import { AppointmentHistoryRepository } from "../repositories/appointmentHistory.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IAppointmentService } from "./appointment.iservice";
import { IAppointmentHistoryService } from "./appointmentHistory.iservice";

export class AppointmentHistoryService implements IAppointmentHistoryService {
  private readonly _appointmentHistoryRepository: AppointmentHistoryRepository;

  public constructor() {
    this._appointmentHistoryRepository = new AppointmentHistoryRepository(
      drizzleInstance,
      appointmentHistoryTable
    );
  }

  public async getAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistory[] | undefined> {
    return await this._appointmentHistoryRepository.getAppointmentHistoryByAppointmentId(
      appointmentId
    );
  }

  public async getAllAppointmentHistoryByAppointmentId(
    appointmentId: string
  ): Promise<AppointmentHistoryInnerJoinPatientAndDoctorAndUser[] | undefined> {
    return await this._appointmentHistoryRepository.getAllAppointmentHistoryByAppointmentId(
      appointmentId
    );
  }

  public async createAppointmentHistory(
    appointmentHistoryCreationAttributes: AppointmentHistoryCreationAttributes
  ): Promise<AppointmentHistory | undefined> {
    return await this._appointmentHistoryRepository.createAppointmentHistory(
      appointmentHistoryCreationAttributes
    );
  }

  public async deleteAppointmentHistory(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this._appointmentHistoryRepository.deleteAppointmentHistory(
      appointmentId
    );
  }
}
