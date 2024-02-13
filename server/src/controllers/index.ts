import { AppointmentController } from "./appointment.controller";
import { AppointmentHistoryController } from "./appointmentHistory.controller";
import { GeneralDataController } from "./generalData.controller";
import { MedicalProcedureController } from "./medicalProcedure.controller";
import { MedicalRecordPatientController } from "./medicalRecordPatient.controller";
import { MedicalSpecialityController } from "./medicalSpeciality.controller";
import { NotificationController } from "./notification.controller";
import { UserController } from "./user.controller";
import { UserPreferencesController } from "./userPreference.controller";

export const userController = new UserController();
export const medicalSpecialityController = new MedicalSpecialityController();
export const appointmentController = new AppointmentController();
export const medicalRecordPatientController =
  new MedicalRecordPatientController();
export const userPreferencesController = new UserPreferencesController();
export const medicalProcedureController = new MedicalProcedureController();
export const appointmentHistoryController = new AppointmentHistoryController();
export const generalDataController = new GeneralDataController();
export const notificationController = new NotificationController();
