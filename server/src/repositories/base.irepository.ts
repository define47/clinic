import {
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";
import { AppointmentHistoryCreationAttributes } from "../models/appointmentHistory.model";
import {
  DoctorSpecialityMappingCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
} from "../models/doctorSpecialityMapping.model";
import {
  RoleCreationAttributes,
  RoleUpdateAttributes,
} from "../models/role.model";
import {
  SpecialityCreationAttributes,
  SpecialityUpdateAttributes,
} from "../models/speciality.model";
import {
  UserCreationAttributes,
  UserUpdateAttributes,
} from "../models/user.model";
import {
  UserRoleMappingCreationAttributes,
  UserRoleMappingUpdateAttributes,
} from "../models/userRoleMapping.model";

export interface IBaseRepository<T> {
  getById(id: string): Promise<T | undefined>;

  getByAttribute(key: any, value: any): Promise<T | undefined>;

  create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
      | AppointmentCreationAttributes
      | UserRoleMappingCreationAttributes
      | DoctorSpecialityMappingCreationAttributes
      | AppointmentCreationAttributes
      | AppointmentHistoryCreationAttributes
  ): Promise<T | undefined>;

  update(
    id: string,
    updateAttributes:
      | UserUpdateAttributes
      | RoleUpdateAttributes
      | SpecialityUpdateAttributes
      | AppointmentUpdateAttributes
      | UserRoleMappingUpdateAttributes
      | DoctorSpecialityMappingUpdateAttributes
      | AppointmentUpdateAttributes
  ): Promise<T | undefined>;

  delete(id: string): Promise<string | undefined>;
}
