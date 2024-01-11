import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
} from "../models/medicalRecordPatient.model";
import { IBaseRepository } from "./base.irepository";

export interface IMedicalRecordPatientRepository
  extends IBaseRepository<MedicalRecordPatient> {
  getMedicalRecordPatientByAppointmentId(
    appointmentId: string
  ): Promise<MedicalRecordPatient | undefined>;

  getMedicalRecordsByPatientId(
    patientId: string
  ): Promise<MedicalRecordPatient[] | undefined>;

  createMedicalRecordPatient(
    medicalRecordPatientCreationAttributes: MedicalRecordPatientCreationAttributes
  ): Promise<MedicalRecordPatient | undefined>;

  updateMedicalRecordPatient(
    appointmentId: string,
    medicalRecordPatientUpdateAttributes: MedicalRecordPatientUpdateAttributes
  ): Promise<MedicalRecordPatient | undefined>;

  deleteMedicalRecordPatient(
    appointmentId: string
  ): Promise<string | undefined>;
}
