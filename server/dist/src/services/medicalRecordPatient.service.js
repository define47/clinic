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
exports.MedicalRecordPatientService = void 0;
const medicalRecordPatient_model_1 = require("../models/medicalRecordPatient.model");
const medicalRecordPatient_repository_1 = require("../repositories/medicalRecordPatient.repository");
const drizzle_1 = require("../utils/drizzle");
class MedicalRecordPatientService {
    constructor() {
        this._medicalRecordPatientRepository = new medicalRecordPatient_repository_1.MedicalRecordPatientRepository(drizzle_1.drizzleInstance, medicalRecordPatient_model_1.medicalRecordPatientTable);
    }
    getMedicalRecordPatientByAppointmentId(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalRecordPatientRepository.getMedicalRecordPatientByAppointmentId(appointmentId);
        });
    }
    getMedicalRecordsByPatientId(patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    createMedicalRecordPatient(medicalRecordPatientCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalRecordPatientRepository.createMedicalRecordPatient(medicalRecordPatientCreationAttributes);
        });
    }
    updateMedicalRecordPatient(appointmentId, medicalRecordPatientUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalRecordPatientRepository.updateMedicalRecordPatient(appointmentId, medicalRecordPatientUpdateAttributes);
        });
    }
    deleteMedicalRecordPatient(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalRecordPatientRepository.deleteMedicalRecordPatient(appointmentId);
        });
    }
}
exports.MedicalRecordPatientService = MedicalRecordPatientService;
