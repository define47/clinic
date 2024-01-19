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
exports.MedicalProcedureService = void 0;
const medicalProcedure_model_1 = require("../models/medicalProcedure.model");
const medicalProcedure_repository_1 = require("../repositories/medicalProcedure.repository");
const drizzle_1 = require("../utils/drizzle");
class MedicalProcedureService {
    constructor() {
        this._medicalProcedureRepository = new medicalProcedure_repository_1.MedicalProcedureRepository(drizzle_1.drizzleInstance, medicalProcedure_model_1.medicalProcedureTable);
    }
    getMedicalProcedureById(medicalProcedureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalProcedureRepository.getMedicalProcedureById(medicalProcedureId);
        });
    }
    getMedicalProcedureByName(medicalProcedureName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getMedicalProcedureByName(medicalProcedureName);
        });
    }
    createMedicalProcedure(medicalProcedureCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createMedicalProcedure(medicalProcedureCreationAttributes);
        });
    }
    updateMedicalProcedure(medicalProcedureId, medicalProcedureUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalProcedureRepository.updateMedicalProcedure(medicalProcedureId, medicalProcedureUpdateAttributes);
        });
    }
    deleteMedicalProcedure(medicalProcedureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._medicalProcedureRepository.deleteMedicalProcedure(medicalProcedureId);
        });
    }
}
exports.MedicalProcedureService = MedicalProcedureService;
