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
exports.MedicalRecordPatientController = void 0;
const medicalRecordPatient_service_1 = require("../services/medicalRecordPatient.service");
class MedicalRecordPatientController {
    constructor() {
        this.postMedicalRecordPatient = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                const medicalRecordPatientToCreate = yield this._medicalRecordPatientService.createMedicalRecordPatient({
                    appointmentId: body.appointmentId,
                    symptoms: body.symptoms,
                    conductedTests: body.conductedTests,
                    diagnosis: body.diagnosis,
                    recommendations: body.recommendations,
                });
                reply.code(200).send({ medicalRecordPatientToCreate });
            }
            catch (error) { }
        });
        this.putMedicalRecordPatient = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                const medicalRecordPatientToUpdate = yield this._medicalRecordPatientService.updateMedicalRecordPatient(body.appointmentId, {
                    symptoms: body.symptoms,
                    conductedTests: body.conductedTests,
                    diagnosis: body.diagnosis,
                    recommendations: body.recommendations,
                    medicalRecordPatientUpdatedAt: new Date(),
                });
                reply
                    .code(200)
                    .send({ medicalRecordPatientToCreate: medicalRecordPatientToUpdate });
            }
            catch (error) { }
        });
        this.deleteMedicalRecordPatient = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                const medicalRecordPatientToDelete = yield this._medicalRecordPatientService.deleteMedicalRecordPatient(body.appointmentId);
                reply.code(200).send({ medicalRecordPatientToDelete });
            }
            catch (error) { }
        });
        this._medicalRecordPatientService = new medicalRecordPatient_service_1.MedicalRecordPatientService();
    }
}
exports.MedicalRecordPatientController = MedicalRecordPatientController;
