import {
  Notification,
  NotificationCreationAttributes,
  notificationTable,
} from "../models/notification.model";
import { NotificationRepository } from "../repositories/notification.repository";
import { drizzleInstance } from "../utils/drizzle";

export class NotificationService {
  private readonly _notificationRepository: NotificationRepository;

  public constructor() {
    this._notificationRepository = new NotificationRepository(
      drizzleInstance,
      notificationTable
    );
  }

  public async createNotification(
    notificationCreationAttributes: NotificationCreationAttributes
  ): Promise<Notification | undefined> {
    return this._notificationRepository.createNotification(
      notificationCreationAttributes
    );
  }
}
