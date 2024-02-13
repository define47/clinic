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
    const query: any = request.query;

    const payload =
      await this._userNotificationMappingService.getNotificationsByUser(
        query.userId
      );

    reply.code(200).send({ success: payload.length > 0, payload });
  }
}
