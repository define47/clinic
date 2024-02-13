import { NotificationCreationAttributes } from "../models/notification.model";
import {
  UserNotificationMapping,
  UserNotificationMappingCreationAttributes,
  userNotificationMappingTable,
} from "../models/userNotificationMapping.model";

import { UserNotificationMappingRepository } from "../repositories/userNotificationMapping.repository";
import { drizzleInstance } from "../utils/drizzle";

export class UserNotificationMappingService {
  private readonly _userNotificationMappingRepository: UserNotificationMappingRepository;

  public constructor() {
    this._userNotificationMappingRepository =
      new UserNotificationMappingRepository(
        drizzleInstance,
        userNotificationMappingTable
      );
  }

  public async createUserNotificationMapping(
    userNotificationMappingCreationAttributes: UserNotificationMappingCreationAttributes
  ): Promise<UserNotificationMapping | undefined> {
    return this._userNotificationMappingRepository.createUserNotificationMapping(
      userNotificationMappingCreationAttributes
    );
  }

  public async markNotificationAsRead(userId: string, notificationId: string) {
    return this._userNotificationMappingRepository.markNotificationAsRead(
      userId,
      notificationId
    );
  }
}
