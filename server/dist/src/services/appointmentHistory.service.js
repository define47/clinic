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
exports.AppointmentHistoryService = void 0;
const appointmentHistory_model_1 = require("../models/appointmentHistory.model");
const appointmentHistory_repository_1 = require("../repositories/appointmentHistory.repository");
const drizzle_1 = require("../utils/drizzle");
class AppointmentHistoryService {
    constructor() {
        this._appointmentHistoryRepository = new appointmentHistory_repository_1.AppointmentHistoryRepository(drizzle_1.drizzleInstance, appointmentHistory_model_1.appointmentHistoryTable);
    }
    getAppointmentHistoryByAppointmentId(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._appointmentHistoryRepository.getAppointmentHistoryByAppointmentId(appointmentId);
        });
    }
    createAppointmentHistory(appointmentHistoryCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._appointmentHistoryRepository.createAppointmentHistory(appointmentHistoryCreationAttributes);
        });
    }
    deleteAppointmentHistory(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._appointmentHistoryRepository.deleteAppointmentHistory(appointmentId);
        });
    }
}
exports.AppointmentHistoryService = AppointmentHistoryService;
