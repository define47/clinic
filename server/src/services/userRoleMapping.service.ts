import { DoctorMedicalSpecialityMappingJoinUserAndSpeciality } from "../models/doctorMedicalSpecialityMapping.model";
import {
  UserRoleMapping,
  UserRoleMappingCreationAttributes,
  UserRoleMappingJoinUserAndRole,
  userRoleMappingTable,
} from "../models/userRoleMapping.model";
import { UserRoleMappingRepository } from "../repositories/userRoleMapping.repository";
import { drizzleInstance } from "../utils/drizzle";
import { IUserRoleMappingService } from "./userRoleMapping.iservice";

export class UserRoleMappingService implements IUserRoleMappingService {
  private readonly _userRoleMappingRepository: UserRoleMappingRepository;

  public constructor() {
    this._userRoleMappingRepository = new UserRoleMappingRepository(
      drizzleInstance,
      userRoleMappingTable
    );
  }

  public async getUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping[] | undefined> {
    return await this._userRoleMappingRepository.getUserRoleMappingByUserIdAndRoleId(
      userId,
      roleId
    );
  }

  public async getUserRoleMappingsByUserId(
    userId: string
  ): Promise<UserRoleMapping[] | undefined> {
    return await this._userRoleMappingRepository.getUserRoleMappingsByUserId(
      userId
    );
  }

  public async getAllUsersRelatedData(
    roleId: string,
    searchBy: string[],
    searchQuery: string,
    limit: number,
    page: number,
    orderBy: string
  ): Promise<
    | {
        tableData:
          | UserRoleMappingJoinUserAndRole[]
          | DoctorMedicalSpecialityMappingJoinUserAndSpeciality[];
        totalCount: number;
        totalPages: number;
      }
    | undefined
  > {
    return await this._userRoleMappingRepository.getAllUsersRelatedData(
      roleId,
      searchBy,
      searchQuery,
      limit,
      page,
      orderBy
    );
  }

  public async createUserRoleMapping(
    userRoleMappingCreationAttributes: UserRoleMappingCreationAttributes
  ): Promise<UserRoleMapping | undefined> {
    return await this._userRoleMappingRepository.createUserRoleMapping(
      userRoleMappingCreationAttributes
    );
  }

  public async updateUserRoleMapping(
    userId: string,
    currentRoleId: string,
    newRoleId: string
  ): Promise<UserRoleMapping | undefined> {
    return await this._userRoleMappingRepository.updateUserRoleMapping(
      userId,
      currentRoleId,
      newRoleId
    );
  }

  public async deleteUserRoleMappingsByUserId(userId: string): Promise<void> {
    return await this._userRoleMappingRepository.deleteUserRoleMappingsByUserId(
      userId
    );
  }

  public async deleteUserRoleMappingByUserIdAndRoleId(
    userId: string,
    roleId: string
  ): Promise<UserRoleMapping | undefined> {
    return await this._userRoleMappingRepository.deleteUserRoleMappingByUserIdAndRoleId(
      userId,
      roleId
    );
  }
}
