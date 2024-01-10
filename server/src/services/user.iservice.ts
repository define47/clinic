import {
  User,
  UserCreationAttributes,
  UserUpdateAttributes,
} from "../models/user.model";

export interface IUserService {
  getUserById(userId: string): Promise<User | undefined>;

  getUserByEmail(userEmail: string): Promise<User | undefined>;

  getUserByPhoneNumber(userPhoneNumber: string): Promise<User | undefined>;

  createUser(
    userCreationAttributes: UserCreationAttributes
  ): Promise<User | undefined>;

  updateUser(
    userId: string,
    userUpdateAttributes: UserUpdateAttributes
  ): Promise<User | undefined>;

  deleteUser(userId: string): Promise<string | undefined>;
}
