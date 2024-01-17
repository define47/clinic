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
exports.UserPreferencesMappingRepository = void 0;
const base_repository_1 = require("./base.repository");
class UserPreferencesMappingRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getUserPreferencesMappingByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getById(userId);
        });
    }
    createUserPreferencesMapping(userPreferencesMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(userPreferencesMappingCreationAttributes);
        });
    }
    updateUserPreferencesMapping(userId, userPreferencesMappingUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(userId, userPreferencesMappingUpdateAttributes);
        });
    }
}
exports.UserPreferencesMappingRepository = UserPreferencesMappingRepository;
