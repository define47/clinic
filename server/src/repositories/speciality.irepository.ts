import {
  Speciality,
  SpecialityCreationAttributes,
  SpecialityUpdateAttributes,
} from "../models/speciality.model";
import { IBaseRepository } from "./base.irepository";

export interface ISpecialityRepository extends IBaseRepository<Speciality> {
  getSpecialityById(specialityId: string): Promise<Speciality | undefined>;

  getSpecialityByName(specialityName: string): Promise<Speciality | undefined>;

  createSpeciality(
    specialityCreationAttributes: SpecialityCreationAttributes
  ): Promise<Speciality | undefined>;

  updateSpeciality(
    specialityUpdateAttributes: SpecialityUpdateAttributes
  ): Promise<Speciality | undefined>;

  deleteSpeciality(specialityId: string): Promise<string | undefined>;
}
