"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const appointment_service_1 = require("../services/appointment.service");
const appointmentHistory_service_1 = require("../services/appointmentHistory.service");
class AppointmentController {
    constructor() {
        this.postAppointment = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                const appointmentToCreate = yield this._appointmentService.createAppointment({
                    appointmentDoctorId: body.appointmentDoctorId,
                    appointmentPatientId: body.appointmentPatientId,
                    appointmentDateTime: new Date(body.appointmentDateTime),
                    appointmentReason: body.appointmentReason,
                    appointmentStatus: body.appointmentStatus,
                });
                if (appointmentToCreate)
                    yield this._appointmentHistoryService.createAppointmentHistory({
                        appointmentId: appointmentToCreate === null || appointmentToCreate === void 0 ? void 0 : appointmentToCreate.appointmentId,
                        appointmentHistoryDoctorId: appointmentToCreate.appointmentDoctorId,
                        appointmentHistoryPatientId: appointmentToCreate.appointmentPatientId,
                        appointmentHistoryDateTime: appointmentToCreate.appointmentDateTime,
                        appointmentHistoryReason: appointmentToCreate.appointmentReason,
                        appointmentHistoryCancellationReason: "",
                        appointmentHistoryStatus: appointmentToCreate.appointmentStatus,
                        appointmentHistoryCreatedAt: new Date(),
                        appointmentHistoryUpdatedAt: new Date(),
                        appointmentHistoryCreatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
                        appointmentHistoryUpdatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
                    });
                reply.code(200).send({ success: true, appointmentToCreate });
            }
            catch (error) { }
        });
        this.updateAppointment = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                let appointmentToUpdate;
                appointmentToUpdate = yield this._appointmentService.updateAppointment(body.appointmentId, {
                    appointmentStatus: body.appointmentStatus,
                    appointmentDateTime: new Date(body.appointmentDateTime),
                    appointmentCancellationReason: body.appointmentCancellationReason,
                });
                console.log(appointmentToUpdate);
                if (appointmentToUpdate) {
                    const appointmentHistory = yield this._appointmentHistoryService.getAppointmentHistoryByAppointmentId(appointmentToUpdate.appointmentId);
                    // if (appointmentHistory) console.log(appointmentHistory[0]);
                    yield this._appointmentHistoryService.createAppointmentHistory({
                        appointmentId: appointmentToUpdate === null || appointmentToUpdate === void 0 ? void 0 : appointmentToUpdate.appointmentId,
                        appointmentHistoryDoctorId: appointmentToUpdate.appointmentDoctorId,
                        appointmentHistoryPatientId: appointmentToUpdate.appointmentPatientId,
                        appointmentHistoryDateTime: new Date(appointmentToUpdate.appointmentDateTime),
                        appointmentHistoryReason: appointmentToUpdate.appointmentReason,
                        appointmentHistoryCancellationReason: appointmentToUpdate.appointmentCancellationReason,
                        appointmentHistoryStatus: appointmentToUpdate.appointmentStatus,
                        appointmentHistoryCreatedAt: appointmentHistory === null || appointmentHistory === void 0 ? void 0 : appointmentHistory[0].appointmentHistoryCreatedAt,
                        appointmentHistoryUpdatedAt: new Date(),
                        appointmentHistoryCreatedBy: appointmentHistory === null || appointmentHistory === void 0 ? void 0 : appointmentHistory[0].appointmentHistoryCreatedBy,
                        appointmentHistoryUpdatedBy: "c27c7196-fd8b-5aee-943e-df266b71fb66",
                    });
                }
                reply.code(200).send({ success: true, appointmentToUpdate });
            }
            catch (error) { }
        });
        this.deleteAppointment = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                yield this._appointmentHistoryService.deleteAppointmentHistory(body.appointmentId);
                const appointmentToDelete = yield this._appointmentService.deleteAppointment(body.appointmentId);
                reply.code(200).send({ success: true, appointmentToDelete });
            }
            catch (error) { }
        });
        this._appointmentService = new appointment_service_1.AppointmentService();
        this._appointmentHistoryService = new appointmentHistory_service_1.AppointmentHistoryService();
    }
}
exports.AppointmentController = AppointmentController;
