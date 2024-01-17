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
exports.AppointmentHistoryRepository = void 0;
const appointmentHistory_model_1 = require("../models/appointmentHistory.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
class AppointmentHistoryRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getAppointmentHistoryByAppointmentId(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._drizzle
                .select()
                .from(appointmentHistory_model_1.appointmentHistoryTable)
                .where((0, drizzle_orm_1.eq)(appointmentHistory_model_1.appointmentHistoryTable.appointmentId, appointmentId));
        });
    }
    createAppointmentHistory(appointmentHistoryCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(appointmentHistoryCreationAttributes);
        });
    }
    deleteAppointmentHistory(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(appointmentId);
        });
    }
}
exports.AppointmentHistoryRepository = AppointmentHistoryRepository;
