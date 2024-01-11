import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
  medicalRecordPatientTable,
} from "../models/medicalRecordPatient.model";
import { MedicalRecordPatientRepository } from "../repositories/medicalRecordPatient.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IMedicalRecordPatientService } from "./medicalRecordPatient.iservice";

export class MedicalRecordPatientService
  implements IMedicalRecordPatientService
{
  private readonly _medicalRecordPatientRepository: MedicalRecordPatientRepository;

  public constructor() {
    this._medicalRecordPatientRepository = new MedicalRecordPatientRepository(
      drizzleInstance,
      medicalRecordPatientTable
    );
  }

  public async getMedicalRecordPatientByAppointmentId(
    appointmentId: string
  ): Promise<MedicalRecordPatient | undefined> {
    return await this._medicalRecordPatientRepository.getMedicalRecordPatientByAppointmentId(
      appointmentId
    );
  }

  public async getMedicalRecordsByPatientId(
    patientId: string
  ): Promise<MedicalRecordPatient[] | undefined> {
    throw new Error("Method not implemented.");
  }

  public async createMedicalRecordPatient(
    medicalRecordPatientCreationAttributes: MedicalRecordPatientCreationAttributes
  ): Promise<MedicalRecordPatient | undefined> {
    return await this._medicalRecordPatientRepository.createMedicalRecordPatient(
      medicalRecordPatientCreationAttributes
    );
  }

  public async updateMedicalRecordPatient(
    appointmentId: string,
    medicalRecordPatientUpdateAttributes: MedicalRecordPatientUpdateAttributes
  ): Promise<MedicalRecordPatient | undefined> {
    return await this._medicalRecordPatientRepository.updateMedicalRecordPatient(
      appointmentId,
      medicalRecordPatientUpdateAttributes
    );
  }

  public async deleteMedicalRecordPatient(
    appointmentId: string
  ): Promise<string | undefined> {
    return await this._medicalRecordPatientRepository.deleteMedicalRecordPatient(
      appointmentId
    );
  }
}
