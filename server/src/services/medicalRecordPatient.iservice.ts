import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
} from "../models/medicalRecordPatient.model";

export interface IMedicalRecordPatientService {
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
