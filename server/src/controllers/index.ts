import { AppointmentController } from "./appointment.controller";
import { MedicalRecordPatientController } from "./medicalRecordPatient.controller";
import { MedicalSpecialityController } from "./medicalSpeciality.controller";
import { UserController } from "./user.controller";
import { UserPreferencesController } from "./userPreference.controller";

export const userController = new UserController();
export const medicalSpecialityController = new MedicalSpecialityController();
export const appointmentController = new AppointmentController();
export const medicalRecordPatientController =
  new MedicalRecordPatientController();
export const userPreferencesController = new UserPreferencesController();
