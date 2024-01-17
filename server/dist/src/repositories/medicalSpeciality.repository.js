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
exports.MedicalSpecialityRepository = void 0;
const medicalSpeciality_model_1 = require("../models/medicalSpeciality.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
class MedicalSpecialityRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getMedicalSpecialityById(medicalSpecialityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getById(medicalSpecialityId);
        });
    }
    getMedicalSpecialityByName(medicalSpecialityName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByAttribute("medicalSpecialityName", medicalSpecialityName);
        });
    }
    getAllMedicalSpecialities(searchQuery, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const condition = {
                medicalSpecialitySearchQuery: (0, drizzle_orm_1.ilike)(medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName, `${searchQuery}%`),
            };
            const totalCount = yield this._drizzle
                .select({ totalCount: (0, drizzle_orm_1.count)() })
                .from(this._table)
                .where(condition.medicalSpecialitySearchQuery);
            const offset = page * limit;
            const medicalSpecialities = yield this._drizzle
                .select({
                medicalSpecialityId: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId,
                medicalSpecialityName: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName,
                medicalSpecialityCreatedAt: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityCreatedAt,
                medicalSpecialityUpdatedAt: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityUpdatedAt,
            })
                .from(this._table)
                .where(condition.medicalSpecialitySearchQuery)
                .limit(limit)
                .offset(offset)
                .orderBy((0, drizzle_orm_1.asc)(medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName));
            return {
                medicalSpecialities,
                totalCount: totalCount[0].totalCount,
                totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
            };
        });
    }
    createMedicalSpeciality(medicalSpecialityCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(medicalSpecialityCreationAttributes);
        });
    }
    updateMedicalSpeciality(medicalSpecialityId, medicalSpecialityUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(medicalSpecialityId, medicalSpecialityUpdateAttributes);
        });
    }
    deleteMedicalSpecialityById(medicalSpecialityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(medicalSpecialityId);
        });
    }
}
exports.MedicalSpecialityRepository = MedicalSpecialityRepository;
