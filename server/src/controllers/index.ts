import { AppointmentController } from "./appointment.controller";
import { MedicalRecordPatientController } from "./medicalRecordPatient.controller";
import { SpecialityController } from "./speciality.controller";
import { UserController } from "./user.controller";

export const userController = new UserController();
export const specialityController = new SpecialityController();
export const appointmentController = new AppointmentController();
export const medicalRecordPatientController =
  new MedicalRecordPatientController();
