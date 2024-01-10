import { User, UserCreationAttributes, userTable } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IUserService } from "./user.iservice";

export class UserService implements IUserService {
  private readonly _userRepository: UserRepository;

  public constructor() {
    this._userRepository = new UserRepository(drizzleInstance, userTable);
  }

  public async getUserById(userId: string): Promise<User | undefined> {
    return await this._userRepository.getUserById(userId);
  }

  public async getUserByEmail(userEmail: string): Promise<User | undefined> {
    return await this._userRepository.getUserByEmail(userEmail);
  }

  public async getUserByPhoneNumber(
    userPhoneNumber: string
  ): Promise<User | undefined> {
    return this._userRepository.getUserByPhoneNumber(userPhoneNumber);
  }

  public async createUser(
    userCreationAttributes: UserCreationAttributes
  ): Promise<User | undefined> {
    return await this._userRepository.createUser(userCreationAttributes);
  }

  public async updateUser(
    userId: string,
    userUpdateAttributes: UserCreationAttributes
  ): Promise<User | undefined> {
    return await this._userRepository.updateUser(userId, userUpdateAttributes);
  }

  public async deleteUser(userId: string): Promise<string | undefined> {
    return await this._userRepository.deleteUser(userId);
  }
}
