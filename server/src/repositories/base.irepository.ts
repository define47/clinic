import { RoleCreationAttributes } from "../models/role.model";
import { SpecialityCreationAttributes } from "../models/speciality.model";
import { UserCreationAttributes } from "../models/user.model";

export interface IBaseRepository<T> {
  getById(id: string): Promise<T>;
  create(
    creationAttributes:
      | UserCreationAttributes
      | RoleCreationAttributes
      | SpecialityCreationAttributes
  ): Promise<void>;
}
