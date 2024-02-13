import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentHistoryService } from "../services/appointmentHistory.service";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";
import { UserNotificationMappingService } from "../services/userNotificationMapping.service";
import { NotificationService } from "../services/notification.service";
import { RoleService } from "../services/role.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { Notification } from "../models/notification.model";

export class AppointmentController {
  private readonly _appointmentService: AppointmentService;
  private readonly _appointmentHistoryService: AppointmentHistoryService;
  private readonly _notificationService;
  private readonly _userNotificationMappingService;
  private readonly _roleService;
  private readonly _userRoleMappingService;

  public constructor() {
    this._appointmentService = new AppointmentService();
    this._appointmentHistoryService = new AppointmentHistoryService();
    this._notificationService = new NotificationService();
    this._userNotificationMappingService = new UserNotificationMappingService();
    this._roleService = new RoleService();
    this._userRoleMappingService = new UserRoleMappingService();
  }
  // doctor-appointment-booked-slots

  private async sendAppointmentNotification(
    request: FastifyRequest,
    notificationAction: string,
    notificationBody: string
  ) {
    const { redis } = fastifyServer;

    const userSessionData = JSON.parse(
      (await redis.sessionRedis.get(`sessionId:${request.cookieData.value}`))!
    );

    const notification = await this._notificationService.createNotification({
      notificationSenderId: userSessionData.userId,
      notificationAction,
      notificationEntity: "appointment",
      notificationBody: JSON.stringify(notificationBody),
      notificationDateTime: new Date(),
    });

    console.log(notification);

    const receptionistRole = await this._roleService.getRoleByName(
      "receptionist"
    );
    const adminRole = await this._roleService.getRoleByName("admin");
    const receptionists =
      (await this._userRoleMappingService.getAllUsersRelatedData(
        receptionistRole?.roleId!,
        ["userForename"],
        "",
        999999999,
        0,
        "asc:userForename"
      ))!.tableData;
    const admins = (await this._userRoleMappingService.getAllUsersRelatedData(
      adminRole?.roleId!,
      ["userForename"],
      "",
      999999999,
      0,
      "asc:userForename"
    ))!.tableData;

    console.log(receptionists);
    console.log(admins);

    for (let i = 0; i < receptionists.length; i++) {
      if (receptionists[i].userId !== userSessionData.userId)
        await this._userNotificationMappingService.createUserNotificationMapping(
          {
            userId: receptionists[i].userId,
            notificationId: notification?.notificationId!,
            isNotificationRead: false,
          }
        );
    }

    for (let i = 0; i < admins.length; i++) {
      if (admins[i].userId !== userSessionData.userId)
        await this._userNotificationMappingService.createUserNotificationMapping(
          {
            userId: admins[i].userId,
            notificationId: notification?.notificationId!,
            isNotificationRead: false,
          }
        );
    }

    console.log("Notification Sent");
  }

  public getDoctorAppointmentBookedSlots = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const query: any = request.query;
    console.log(query.doctorId);

    const payload =
      await this._appointmentService.getDoctorAppointmentBookedSlots(
        query.doctorId,
        query.date
      );

    console.log(payload);

    reply.code(200).send({ success: true, payload });
  };

  public retrieveAllUsersRelatedData = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

      console.log("query app", query.customStartDate);

      let payload;

      payload = await this._appointmentService.getAllAppointments(
        query.searchInTable,
        query.orderInTable,
        query.searchBy.split(","),
        query.searchQuery,
        query.scheduleFilter,
        query.customStartDate,
        query.customEndDate,
        // query.orderBy.split(","),
        query.orderBy,
        parseInt(query.limit),
        parseInt(query.page),
        query.doctorId,
        query.patientId
      );

      reply.code(200).send({ success: true, payload });
    } catch (error) {
      console.log(error);
    }
  };

  public postAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;

      const appointmentToCreate =
        await this._appointmentService.createAppointment({
          appointmentDoctorId: body.appointmentDoctorId,
          appointmentPatientId: body.appointmentPatientId,
          appointmentDateTime: new Date(body.appointmentDateTime),
          appointmentReason: body.appointmentReason,
          appointmentStatus: body.appointmentStatus,
        });

      const appointmentData =
        await this._appointmentService.getAppointmentJoinDoctorAndPatient(
          appointmentToCreate?.appointmentId!
        );

      const userSessionData = JSON.parse(
        (await redis.sessionRedis.get(`sessionId:${request.cookieData.value}`))!
      );

      if (!appointmentToCreate)
        reply.code(200).send({ message: "not created" });

      await this._appointmentHistoryService.createAppointmentHistory({
        appointmentId: appointmentToCreate?.appointmentId!,
        appointmentHistoryDoctorId: appointmentToCreate?.appointmentDoctorId!,
        appointmentHistoryPatientId: appointmentToCreate?.appointmentPatientId!,
        appointmentHistoryDateTime: appointmentToCreate?.appointmentDateTime!,
        appointmentHistoryReason: appointmentToCreate?.appointmentReason!,
        appointmentHistoryCancellationReason: "",
        appointmentHistoryStatus: appointmentToCreate?.appointmentStatus!,
        appointmentHistoryCreatedAt: new Date(),
        appointmentHistoryUpdatedAt: new Date(),
        appointmentHistoryCreatedBy: userSessionData.userId,
        appointmentHistoryUpdatedBy: userSessionData.userId,
      });

      await this.sendAppointmentNotification(
        request,
        "create",
        JSON.stringify(appointmentToCreate)
      );

      if (appointmentData)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createAppointment",
            entity: "appointment",
            data: appointmentData,
          })
        );

      reply.code(200).send({ success: true, appointmentToCreate });
    } catch (error) {}
  };

  public updateAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      let appointmentToUpdate;
      console.log("body update appointment", body);

      appointmentToUpdate = await this._appointmentService.updateAppointment(
        body.appointmentId,
        {
          appointmentReason: body.appointmentReason,
          appointmentStatus: body.appointmentStatus,
          appointmentDateTime: new Date(body.appointmentDateTime),
          appointmentCancellationReason: body.appointmentCancellationReason,
        }
      );
      const { redis } = fastifyServer;

      const userSessionData = JSON.parse(
        (await redis.sessionRedis.get(`sessionId:${request.cookieData.value}`))!
      );

      console.log(userSessionData.userId);

      if (!appointmentToUpdate)
        reply.code(200).send({ message: "didn't work update" });

      // if (appointmentToUpdate) {
      const appointmentHistory =
        await this._appointmentHistoryService.getAppointmentHistoryByAppointmentId(
          appointmentToUpdate?.appointmentId!
        );

      await this._appointmentHistoryService.createAppointmentHistory({
        appointmentId: appointmentToUpdate?.appointmentId!,
        appointmentHistoryDoctorId: appointmentToUpdate?.appointmentDoctorId!,
        appointmentHistoryPatientId: appointmentToUpdate?.appointmentPatientId!,
        appointmentHistoryDateTime: new Date(
          appointmentToUpdate?.appointmentDateTime!
        ),
        appointmentHistoryReason: appointmentToUpdate?.appointmentReason!,
        appointmentHistoryCancellationReason:
          appointmentToUpdate?.appointmentCancellationReason!,
        appointmentHistoryStatus: appointmentToUpdate?.appointmentStatus!,
        appointmentHistoryCreatedAt:
          appointmentHistory?.[0].appointmentHistoryCreatedAt!,
        appointmentHistoryUpdatedAt: new Date(),
        appointmentHistoryCreatedBy:
          appointmentHistory?.[0].appointmentHistoryCreatedBy!,
        appointmentHistoryUpdatedBy: userSessionData.userId,
      });
      // }

      await this.sendAppointmentNotification(
        request,
        "update",
        JSON.stringify(appointmentToUpdate)
      );

      const appointmentData =
        await this._appointmentService.getAppointmentJoinDoctorAndPatient(
          appointmentToUpdate?.appointmentId!
        );

      if (appointmentData)
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "updateAppointment",
            data: appointmentData,
          })
        );

      reply.code(200).send({ success: true });
    } catch (error) {
      console.log(error);
    }
  };

  public deleteAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;

      await this._appointmentHistoryService.deleteAppointmentHistory(
        body.appointmentId
      );

      const appointmentToDelete =
        await this._appointmentService.deleteAppointment(body.appointmentId);

      await this.sendAppointmentNotification(
        request,
        "delete",
        JSON.stringify(appointmentToDelete)
      );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteAppointment",
          data: appointmentToDelete,
        })
      );

      reply.code(200).send({ success: true, appointmentToDelete });
    } catch (error) {}
  };
}
