import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentHistoryService } from "../services/appointmentHistory.service";
import { MESSAGE_CHANNEL, fastifyServer } from "../server";
import { UserNotificationMappingService } from "../services/userNotificationMapping.service";
import { NotificationService } from "../services/notification.service";
import { RoleService } from "../services/role.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { Notification } from "../models/notification.model";
import { UserService } from "../services/user.service";
import {
  Appointment,
  AppointmentJoinDoctorAndPatient,
} from "../models/appointment.model";
import { sendSms } from "../utils/sms";
import { User } from "../models/user.model";
import { getCurrentSessionData } from "../utils/utils";
import { getEntityMessage } from "../utils/serverLanguages";

export class AppointmentController {
  private readonly _appointmentService: AppointmentService;
  private readonly _appointmentHistoryService: AppointmentHistoryService;
  private readonly _notificationService;
  private readonly _userNotificationMappingService;
  private readonly _roleService;
  private readonly _userRoleMappingService;
  private readonly _userService;
  // private _doctorIdAppointment;

  public constructor() {
    this._appointmentService = new AppointmentService();
    this._appointmentHistoryService = new AppointmentHistoryService();
    this._notificationService = new NotificationService();
    this._userNotificationMappingService = new UserNotificationMappingService();
    this._roleService = new RoleService();
    this._userRoleMappingService = new UserRoleMappingService();
    this._userService = new UserService();
    // this._doctorIdAppointment = "";
  }
  // doctor-appointment-booked-slots

  public async getAppointmentCountByPeriodAndStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const query: any = request.query;
      const payload =
        await this._appointmentService.getAppointmentCountByPeriodAndStatus(
          query.period,
          query.appointmentStatus
        );

      reply.code(200).send({ success: payload !== undefined, payload });
    } catch (error) {
      console.log(error);
    }
  }

  private async sendAppointmentNotification(
    request: FastifyRequest,
    notificationAction: string,
    appointment: Appointment,
    doctor: User,
    patient: User
  ) {
    const { redis } = fastifyServer;

    const userSessionData = JSON.parse(
      (await redis.sessionRedis.get(`sessionId:${request.cookieData.value}`))!
    );

    const notification = await this._notificationService.createNotification({
      notificationSenderId: userSessionData.userId,
      notificationAction,
      notificationEntity: "appointment",
      notificationBody: JSON.stringify(
        JSON.stringify({
          appointment: {
            appointmentDateTime: appointment?.appointmentDateTime,
            appointmentStatus: appointment?.appointmentStatus,
          },
          patient,
          doctor,
        })
      ),
      notificationDateTime: new Date(),
    });

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
            receiverId: receptionists[i].userId,
            notificationId: notification?.notificationId!,
            isNotificationRead: false,
          }
        );
    }

    for (let i = 0; i < admins.length; i++) {
      if (admins[i].userId !== userSessionData.userId)
        await this._userNotificationMappingService.createUserNotificationMapping(
          {
            receiverId: admins[i].userId,
            notificationId: notification?.notificationId!,
            isNotificationRead: false,
          }
        );
    }

    // for (let i = 0; i < admins.length; i++) {
    //   if (admins[i].userId !== this._doctorIdAppointment)
    //     await this._userNotificationMappingService.createUserNotificationMapping(
    //       {
    //         receiverId: this._doctorIdAppointment,
    //         notificationId: notification?.notificationId!,
    //         isNotificationRead: false,
    //       }
    //     );
    // }

    await this._userNotificationMappingService.createUserNotificationMapping({
      receiverId: doctor.userId,
      notificationId: notification?.notificationId!,
      isNotificationRead: false,
    });

    return notification;
  }

  public getDoctorAppointmentBookedSlots = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const query: any = request.query;
    const payload =
      await this._appointmentService.getDoctorAppointmentBookedSlots(
        query.doctorId,
        query.date
      );

    reply.code(200).send({ success: true, payload });
  };

  public getAppointmentById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;
      const payload =
        await this._appointmentService.getAppointmentByIdJoinDoctorAndPatient(
          query.appointmentId
        );
      reply.code(200).send({ success: payload !== undefined, payload });
    } catch (error) {}
  };

  public getAllAppointments = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

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
      const currentSessionValue = await getCurrentSessionData(request);
      const { redis } = fastifyServer;
      const body: any = request.body;

      const appointmentToCreate =
        await this._appointmentService.createAppointment({
          appointmentDoctorId: body.appointmentDoctorId,
          appointmentPatientId: body.appointmentPatientId,
          appointmentDateTime: new Date(body.appointmentDateTime),
          appointmentReason: body.appointmentReason,
          appointmentStatus: body.appointmentStatus,
        });

      const appointmentData =
        await this._appointmentService.getAppointmentByIdJoinDoctorAndPatient(
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

      // this._doctorIdAppointment = appointmentToCreate?.appointmentDoctorId!;
      const patient = await this._userService.getUserById(
        appointmentToCreate?.appointmentPatientId!
      );
      const doctor = await this._userService.getUserById(
        appointmentToCreate?.appointmentDoctorId!
      );

      const notification = await this.sendAppointmentNotification(
        request,
        "create",
        appointmentToCreate!,
        doctor!,
        patient!
      );

      if (appointmentData) {
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createAppointment",
            entity: "appointment",
            data: appointmentData,
          })
        );

        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "createAppointmentNotification",
            entity: "appointmentNotification",
            data: {
              receiver: {
                receiverDoctorId: doctor?.userId,
                receiverPatientId: patient?.userId,
              },
              notification: {
                notificationId: notification?.notificationId,
                notificationAction: notification?.notificationAction,
                notificationEntity: notification?.notificationEntity,
                notificationBody: notification?.notificationBody,
                notificationDateTime: notification?.notificationDateTime,
              },
              sender: {
                senderId: notification?.notificationSenderId,
                senderForename: currentSessionValue.userForename,
                senderSurname: currentSessionValue.userSurname,
              },
            },
          })
        );
      }

      // sendSms(
      //   patient?.userPhoneNumber!,
      //   `Programare ${appointmentToCreate?.appointmentDateTime} Iatropolis`
      // );

      return reply.code(200).send({
        success: appointmentToCreate !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "appointment",
          "create",
          appointmentToCreate !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {}
  };

  public updateAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const currentSessionValue = await getCurrentSessionData(request);
      const { redis } = fastifyServer;
      const body: any = request.body;
      let appointmentToUpdate;

      appointmentToUpdate = await this._appointmentService.updateAppointment(
        body.appointmentId,
        {
          appointmentReason: body.appointmentReason,
          appointmentStatus: body.appointmentStatus,
          appointmentDateTime: new Date(body.appointmentDateTime),
          appointmentCancellationReason: body.appointmentCancellationReason,
          appointmentPrice: body.appointmentPrice,
        }
      );

      const userSessionData = JSON.parse(
        (await redis.sessionRedis.get(`sessionId:${request.cookieData.value}`))!
      );

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

      const patient = await this._userService.getUserById(
        appointmentToUpdate?.appointmentPatientId!
      );
      const doctor = await this._userService.getUserById(
        appointmentToUpdate?.appointmentDoctorId!
      );

      const notification = await this.sendAppointmentNotification(
        request,
        "update",
        appointmentToUpdate!,
        doctor!,
        patient!
      );

      // await this.sendAppointmentNotification(
      //   request,
      //   "update",
      //   // JSON.stringify(appointmentToCreate)
      //   JSON.stringify({
      //     appointment: {
      //       appointmentDateTime: appointmentToUpdate?.appointmentDateTime,
      //       appointmentStatus: appointmentToUpdate?.appointmentStatus,
      //     },
      //     patient: await this._userService.getUserById(
      //       appointmentToUpdate?.appointmentPatientId!
      //     ),
      //     doctor: await this._userService.getUserById(
      //       appointmentToUpdate?.appointmentDoctorId!
      //     ),
      //   })
      // );

      // await this.sendAppointmentNotification(
      //   request,
      //   "update",
      //   JSON.stringify(appointmentToUpdate)
      // );

      const appointmentData =
        await this._appointmentService.getAppointmentByIdJoinDoctorAndPatient(
          appointmentToUpdate?.appointmentId!
        );

      if (appointmentData) {
        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "updateAppointment",
            data: appointmentData,
          })
        );

        await redis.publisher.publish(
          MESSAGE_CHANNEL,
          JSON.stringify({
            action: "updateAppointmentNotification",
            entity: "appointmentNotification",
            data: {
              receiver: {
                receiverDoctorId: doctor?.userId,
                receiverPatientId: patient?.userId,
              },
              notification: {
                notificationId: notification?.notificationId,
                notificationAction: notification?.notificationAction,
                notificationEntity: notification?.notificationEntity,
                notificationBody: notification?.notificationBody,
                notificationDateTime: notification?.notificationDateTime,
              },
              sender: {
                senderId: notification?.notificationSenderId,
                senderForename: currentSessionValue.userForename,
                senderSurname: currentSessionValue.userSurname,
              },
            },
          })
        );
      }

      return reply.code(200).send({
        success: appointmentToUpdate !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "appointment",
          "update",
          appointmentToUpdate !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  public deleteAppointment = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const currentSessionValue = await getCurrentSessionData(request);
      const { redis } = fastifyServer;
      const body: any = request.body;

      await this._appointmentHistoryService.deleteAppointmentHistory(
        body.appointmentId
      );

      // const appointment =
      //   await this._appointmentService.getAppointmentByIdJoinDoctorAndPatient(
      //     body.appointmentId
      //   );

      const appointment = await this._appointmentService.getAppointmentById(
        body.appointmentId
      );

      console.log("appointment", appointment);

      const appointmentToDelete =
        await this._appointmentService.deleteAppointment(body.appointmentId);

      console.log("appointmentToDelete", appointmentToDelete);

      const patient = await this._userService.getUserById(
        appointment?.appointmentPatientId!
      );
      const doctor = await this._userService.getUserById(
        appointment?.appointmentDoctorId!
      );

      const notification = await this.sendAppointmentNotification(
        request,
        "delete",
        appointment!,
        doctor!,
        patient!
      );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteAppointment",
          data: appointmentToDelete,
        })
      );

      await redis.publisher.publish(
        MESSAGE_CHANNEL,
        JSON.stringify({
          action: "deleteAppointmentNotification",
          entity: "appointmentNotification",
          data: {
            receiver: {
              receiverDoctorId: doctor?.userId,
              receiverPatientId: patient?.userId,
            },
            notification: {
              notificationId: notification?.notificationId,
              notificationAction: notification?.notificationAction,
              notificationEntity: notification?.notificationEntity,
              notificationBody: notification?.notificationBody,
              notificationDateTime: notification?.notificationDateTime,
            },
            sender: {
              senderId: notification?.notificationSenderId,
              senderForename: currentSessionValue.userForename,
              senderSurname: currentSessionValue.userSurname,
            },
          },
        })
      );

      return reply.code(200).send({
        success: appointmentToDelete !== undefined,
        message: getEntityMessage(
          currentSessionValue.language.languageCode,
          "appointment",
          "delete",
          appointmentToDelete !== undefined ? "success" : "error"
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };
}
