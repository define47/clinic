import {
  AppointmentCreationAttributes,
  AppointmentUpdateAttributes,
} from "../models/appointment.model";
import {
  DoctorSpecialityMappingCreationAttributes,
  DoctorSpecialityMappingUpdateAttributes,
} from "../models/doctorSpecialitiesMappings";
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
} from "../models/userRolesMappings.model";

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
  ): Promise<T | undefined>;

  delete(id: string): Promise<string | undefined>;
}
