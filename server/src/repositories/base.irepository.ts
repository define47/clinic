import {
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";
import { AppointmentHistoryCreationAttributes } from "../models/appointmentHistory.model";
import {
  DoctorMedicalSpecialityMappingCreationAttributes,
  DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
} from "../models/doctorMedicalSpecialityMapping.model";
import { LanguageCreationAttributes } from "../models/language.model";
import {
  MedicalRecordPatientCreationAttributes,
  MedicalRecordPatientUpdateAttributes,
} from "../models/medicalRecordPatient.model";
import {
  RoleCreationAttributes,
  RoleUpdateAttributes,
} from "../models/role.model";
import {
  MedicalSpecialityCreationAttributes,
  MedicalSpecialityUpdateAttributes,
} from "../models/medicalSpeciality.model";
import {
  UserCreationAttributes,
  UserUpdateAttributes,
} from "../models/user.model";
import {
  UserPreferencesMappingCreationAttributes,
  UserPreferencesMappingUpdateAttributes,
} from "../models/userPreferencesMapping.model";
import {
  UserRoleMappingCreationAttributes,
  UserRoleMappingUpdateAttributes,
} from "../models/userRoleMapping.model";
import {
  MedicalSpecialityMedicalProcedureMappingCreationAttributes,
  MedicalSpecialityMedicalProcedureMappingUpdateAttributes,
} from "../models/medicalSpecialityMedicalProcedureMapping.model";
import { NotificationCreationAttributes } from "../models/notification.model";
import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
} from "../models/patient.model";

export interface IBaseRepository<T> {
  getById(id: string): Promise<T | undefined>;

  getByAttribute(key: any, value: any): Promise<T | undefined>;

  create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | MedicalSpecialityCreationAttributes
      | AppointmentCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorMedicalSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
      | MedicalRecordPatientCreationAttributes
      | LanguageCreationAttributes
      | UserPreferencesMappingCreationAttributes
      | MedicalSpecialityMedicalProcedureMappingCreationAttributes
      | DoctorMedicalSpecialityMappingKnownMedicalSpecialityRankCreationAttributes
      | NotificationCreationAttributes
      | PatientCreationAttributes
  ): Promise<T | undefined>;

  update(
    id: string,
    updateAttributes:
      | UserUpdateAttributes
      | RoleUpdateAttributes
      | MedicalSpecialityUpdateAttributes
      | AppointmentUpdateAttributes
      | UserRoleMappingUpdateAttributes
      | DoctorSpecialityMappingUpdateAttributes
      | AppointmentUpdateAttributes
      | MedicalRecordPatientUpdateAttributes
      | UserPreferencesMappingUpdateAttributes
      | MedicalSpecialityMedicalProcedureMappingUpdateAttributes
      | PatientUpdateAttributes
  ): Promise<T | undefined>;

  delete(id: string): Promise<string | undefined>;
}
