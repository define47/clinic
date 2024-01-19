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
exports.MedicalSpecialityController = void 0;
const medicalSpeciality_service_1 = require("../services/medicalSpeciality.service");
class MedicalSpecialityController {
    constructor() {
        this.postMedicalSpeciality = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                let medicalSpecialityToCreate = yield this._medicalSpecialityService.createMedicalSpeciality({
                    medicalSpecialityName: body.specialityName,
                });
                return reply.code(200).send({ success: true, message: "" });
            }
            catch (error) { }
        });
        this.putMedicalSpeciality = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                let medicalSpecialityToUpdate = yield this._medicalSpecialityService.updateMedicalSpeciality(body.specialityId, {
                    medicalSpecialityName: body.medicalSpecialityName,
                });
                return reply.code(200).send({ success: true, message: "" });
            }
            catch (error) { }
        });
        this.deleteMedicalSpeciality = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                let medicalSpecialityToDelete = yield this._medicalSpecialityService.deleteMedicalSpecialityById(body.specialityId);
                return reply.code(200).send({ success: true, message: "" });
            }
            catch (error) { }
        });
        this._medicalSpecialityService = new medicalSpeciality_service_1.MedicalSpecialityService();
    }
}
exports.MedicalSpecialityController = MedicalSpecialityController;
