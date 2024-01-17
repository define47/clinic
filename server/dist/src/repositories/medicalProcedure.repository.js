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
exports.MedicalProcedureRepository = void 0;
const base_repository_1 = require("./base.repository");
class MedicalProcedureRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getMedicalProcedureById(medicalProcedureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getById(medicalProcedureId);
        });
    }
    getMedicalProcedureByName(medicalProcedureName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByAttribute("medicalProcedureName", medicalProcedureName);
        });
    }
    createMedicalProcedure(medicalProcedureCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(medicalProcedureCreationAttributes);
        });
    }
    updateMedicalProcedure(medicalProcedureId, medicalProcedureUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(medicalProcedureId, medicalProcedureUpdateAttributes);
        });
    }
    deleteMedicalProcedure(medicalProcedureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(medicalProcedureId);
        });
    }
}
exports.MedicalProcedureRepository = MedicalProcedureRepository;
