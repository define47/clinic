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
exports.AppointmentService = void 0;
const appointment_model_1 = require("../models/appointment.model");
const appointment_repository_1 = require("../repositories/appointment.repository");
const drizzle_1 = require("../utils/drizzle");
class AppointmentService {
    constructor() {
        this._appointmentRepository = new appointment_repository_1.AppointmentRepository(drizzle_1.drizzleInstance, appointment_model_1.appointmentTable);
    }
    createAppointment(appointmentCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._appointmentRepository.createAppointment(appointmentCreationAttributes);
        });
    }
    updateAppointment(appointmentId, appointmentUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._appointmentRepository.updateAppointment(appointmentId, appointmentUpdateAttributes);
        });
    }
    deleteAppointment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._appointmentRepository.deleteAppointment(appointmentId);
        });
    }
}
exports.AppointmentService = AppointmentService;
