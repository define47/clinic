import { FastifyReply, FastifyRequest } from "fastify";
import { NotificationService } from "../services/notification.service";
import { UserNotificationMappingService } from "../services/userNotificationMapping.service";

export class NotificationController {
  private readonly _notificationService: NotificationService;
  private readonly _userNotificationMappingService: UserNotificationMappingService;

  public constructor() {
    this._notificationService = new NotificationService();
    this._userNotificationMappingService = new UserNotificationMappingService();
  }

  public async getNotificationsByUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const payload =
      await this._userNotificationMappingService.getNotificationsByUser(
        "7985f290-f148-5d3c-91c9-d0966e12ba79"
      );

    reply.code(200).send({ success: true, payload });
  }
}
