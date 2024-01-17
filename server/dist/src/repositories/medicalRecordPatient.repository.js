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
exports.MedicalRecordPatientRepository = void 0;
const medicalRecordPatient_model_1 = require("../models/medicalRecordPatient.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("../models/user.model");
class MedicalRecordPatientRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getMedicalRecordPatientByAppointmentId(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getMedicalRecordPatientByAppointmentId(appointmentId);
        });
    }
    getMedicalRecordsByPatientId(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._drizzle
                .select()
                .from(medicalRecordPatient_model_1.medicalRecordPatientTable)
                .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(user_model_1.userTable.userId, patientId));
        });
    }
    createMedicalRecordPatient(medicalRecordPatientCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(medicalRecordPatientCreationAttributes);
        });
    }
    updateMedicalRecordPatient(appointmentId, medicalRecordPatientUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(appointmentId, medicalRecordPatientUpdateAttributes);
        });
    }
    deleteMedicalRecordPatient(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(appointmentId);
        });
    }
}
exports.MedicalRecordPatientRepository = MedicalRecordPatientRepository;
