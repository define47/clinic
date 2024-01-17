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
exports.DoctorMedicalSpecialityMappingService = void 0;
const doctorMedicalSpecialityMapping_model_1 = require("../models/doctorMedicalSpecialityMapping.model");
const doctorMedicalSpecialityMapping_repository_1 = require("../repositories/doctorMedicalSpecialityMapping.repository");
const drizzle_1 = require("../utils/drizzle");
class DoctorMedicalSpecialityMappingService {
    constructor() {
        this._doctorMedicalSpecialityMappingRepository =
            new doctorMedicalSpecialityMapping_repository_1.DoctorMedicalSpecialityMappingRepository(drizzle_1.drizzleInstance, doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable);
    }
    getDoctorMedicalSpecialityMappingsByDoctorId(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._doctorMedicalSpecialityMappingRepository.getDoctorMedicalSpecialityMappingsByDoctorId(doctorId);
        });
    }
    createMedicalDoctorSpecialityMapping(doctorMedicalSpecialityMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._doctorMedicalSpecialityMappingRepository.createDoctorMedicalSpecialityMapping(doctorMedicalSpecialityMappingCreationAttributes);
        });
    }
    updateDoctorMedicalSpecialityMapping(doctorId, currentMedicalSpecialityId, newMedicalSpecialityId, isPrimaryMedicalSpeciality, isSecondaryMedicalSpeciality, isTertiaryMedicalSpeciality) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._doctorMedicalSpecialityMappingRepository.updateMedicalDoctorSpecialityMapping(doctorId, currentMedicalSpecialityId, newMedicalSpecialityId, isPrimaryMedicalSpeciality, isSecondaryMedicalSpeciality, isTertiaryMedicalSpeciality);
        });
    }
    deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(doctorId, medicalSpecialityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._doctorMedicalSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(doctorId, medicalSpecialityId);
        });
    }
    deleteDoctorMedicalSpecialityMappingsByDoctorId(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._doctorMedicalSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingsByDoctorId(doctorId);
        });
    }
}
exports.DoctorMedicalSpecialityMappingService = DoctorMedicalSpecialityMappingService;
