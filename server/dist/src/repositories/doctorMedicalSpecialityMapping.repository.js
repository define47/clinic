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
exports.DoctorMedicalSpecialityMappingRepository = void 0;
const doctorMedicalSpecialityMapping_model_1 = require("../models/doctorMedicalSpecialityMapping.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
class DoctorMedicalSpecialityMappingRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getDoctorMedicalSpecialityMappingsByDoctorId(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._drizzle
                .select()
                .from(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                .where((0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.doctorId, doctorId));
        });
    }
    createDoctorMedicalSpecialityMapping(doctorMedicalSpecialityMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(doctorMedicalSpecialityMappingCreationAttributes);
        });
    }
    deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(doctorId, medicalSpecialityId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this._drizzle
                .delete(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.doctorId, doctorId), (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.medicalSpecialityId, medicalSpecialityId)))
                .returning({
                specialityId: doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.medicalSpecialityId,
            }))[0]) === null || _a === void 0 ? void 0 : _a.specialityId;
        });
    }
    updateMedicalDoctorSpecialityMapping(doctorId, currentMedicalSpecialityId, newMedicalSpecialityId, isPrimaryMedicalSpeciality, isSecondaryMedicalSpeciality, isTertiaryMedicalSpeciality) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._drizzle
                .update(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                .set({
                medicalSpecialityId: newMedicalSpecialityId,
                isPrimaryMedicalSpeciality,
                isSecondaryMedicalSpeciality,
                isTertiaryMedicalSpeciality,
            })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.doctorId, doctorId), (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.medicalSpecialityId, currentMedicalSpecialityId)));
        });
    }
    deleteDoctorMedicalSpecialityMappingsByDoctorId(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(yield this.delete(doctorId));
            // await this.delete(doctorId)
        });
    }
}
exports.DoctorMedicalSpecialityMappingRepository = DoctorMedicalSpecialityMappingRepository;
