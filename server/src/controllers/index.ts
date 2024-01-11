import { AppointmentController } from "./appointment.controller";
import { SpecialityController } from "./speciality.controller";
import { UserController } from "./user.controller";

export const userController = new UserController();
export const specialityController = new SpecialityController();
export const appointmentController = new AppointmentController();
