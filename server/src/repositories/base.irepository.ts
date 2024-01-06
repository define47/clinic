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

export interface IBaseRepository<T> {
  getById(id: string): Promise<T | undefined>;
  create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
  ): Promise<T | undefined>;

  update(
    id: string,
    updateAttributes:
      | UserUpdateAttributes
      | RoleUpdateAttributes
      | SpecialityUpdateAttributes
  ): Promise<T | undefined>;

  delete(id: string): Promise<string | undefined>;
}
