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
exports.UserPreferencesMappingService = void 0;
const userPreferencesMapping_model_1 = require("../models/userPreferencesMapping.model");
const userPreferencesMapping_repository_1 = require("../repositories/userPreferencesMapping.repository");
const drizzle_1 = require("../utils/drizzle");
class UserPreferencesMappingService {
    constructor() {
        this._userPreferencesMappingRepository =
            new userPreferencesMapping_repository_1.UserPreferencesMappingRepository(drizzle_1.drizzleInstance, userPreferencesMapping_model_1.userPreferencesMappingTable);
    }
    getUserPreferencesMappingByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userPreferencesMappingRepository.getUserPreferencesMappingByUserId(userId);
        });
    }
    createUserPreferencesMapping(userPreferencesMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userPreferencesMappingRepository.createUserPreferencesMapping(userPreferencesMappingCreationAttributes);
        });
    }
    updateUserPreferencesMapping(userId, userPreferencesMappingUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userPreferencesMappingRepository.updateUserPreferencesMapping(userId, userPreferencesMappingUpdateAttributes);
        });
    }
}
exports.UserPreferencesMappingService = UserPreferencesMappingService;
