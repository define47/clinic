import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  User,
  UserCreationAttributes,
  UserUpdateAttributes,
} from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "./user.irepository";
import { Table } from "drizzle-orm";

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getUserById(userId: string): Promise<User | undefined> {
    return await this.getById(userId);
  }

  public async getUserByEmail(userEmail: string): Promise<User | undefined> {
    return await this.getByAttribute("userEmail", userEmail);
  }

  public async getUserByPhoneNumber(
    userPhoneNumber: string
  ): Promise<User | undefined> {
    return await this.getByAttribute("userPhoneNumber", userPhoneNumber);
  }

  public async createUser(
    userCreationAttributes: UserCreationAttributes
  ): Promise<User | undefined> {
    return await this.create(userCreationAttributes);
  }

  public async updateUser(
    userId: string,
    userUpdateAttributes: UserUpdateAttributes
  ): Promise<User | undefined> {
    return await this.update(userId, userUpdateAttributes);
  }

  public async deleteUser(userId: string): Promise<string | undefined> {
    return await this.delete(userId);
  }
}
