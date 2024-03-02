import {
  MedicalRecordPatient,
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
} from "../models/medicalRecordPatient.model";

export interface IMedicalRecordPatientService {
  getMedicalRecordPatientByAppointmentId(
    appointmentId: string
  ): Promise<MedicalRecordPatient | undefined>;

  getMedicalRecordsByPatientIdAndDoctorId(
    doctorId: string,
    patientId: string
  ): Promise<any>;

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
