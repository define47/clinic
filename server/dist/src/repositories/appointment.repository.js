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
exports.AppointmentRepository = void 0;
const appointment_model_1 = require("../models/appointment.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("../models/user.model");
class AppointmentRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getAllAppointments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._drizzle
                    .select({
                    appointment: {
                        appointmentId: appointment_model_1.appointmentTable.appointmentId,
                        appointmentDoctorId: appointment_model_1.appointmentTable.appointmentDoctorId,
                        appointmentPatientId: appointment_model_1.appointmentTable.appointmentPatientId,
                        appointmentReason: appointment_model_1.appointmentTable.appointmentReason,
                        appointmentDateTime: appointment_model_1.appointmentTable.appointmentDateTime,
                        appointmentStatus: appointment_model_1.appointmentTable.appointmentStatus,
                        appointmentCancellationReason: appointment_model_1.appointmentTable.appointmentCancellationReason,
                    },
                    doctor: {
                        doctorId: user_model_1.userTable.userId,
                        doctorForename: user_model_1.userTable.userForename,
                        doctorSurname: user_model_1.userTable.userSurname,
                    },
                    patient: {
                        patientId: user_model_1.userTable.userId,
                        patientForename: user_model_1.userTable.userForename,
                        patientSurname: user_model_1.userTable.userSurname,
                        patientEmail: user_model_1.userTable.userEmail,
                    },
                })
                    .from(appointment_model_1.appointmentTable)
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentDoctorId, user_model_1.userTable.userId))
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentPatientId, user_model_1.userTable.userId));
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createAppointment(appointmentCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(appointmentCreationAttributes);
        });
    }
    updateAppointment(appointmentId, appointmentUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(appointmentId, appointmentUpdateAttributes);
        });
    }
    deleteAppointment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(appointmentId);
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
