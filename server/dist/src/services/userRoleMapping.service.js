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
exports.UserRoleMappingService = void 0;
const userRoleMapping_model_1 = require("../models/userRoleMapping.model");
const userRoleMapping_repository_1 = require("../repositories/userRoleMapping.repository");
const drizzle_1 = require("../utils/drizzle");
class UserRoleMappingService {
    constructor() {
        this._userRoleMappingRepository = new userRoleMapping_repository_1.UserRoleMappingRepository(drizzle_1.drizzleInstance, userRoleMapping_model_1.userRoleMappingTable);
    }
    getUserRoleMappingByUserIdAndRoleId(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.getUserRoleMappingByUserIdAndRoleId(userId, roleId);
        });
    }
    getUserRoleMappingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.getUserRoleMappingsByUserId(userId);
        });
    }
    createUserRoleMapping(userRoleMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.createUserRoleMapping(userRoleMappingCreationAttributes);
        });
    }
    updateUserRoleMapping(userId, currentRoleId, newRoleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.updateUserRoleMapping(userId, currentRoleId, newRoleId);
        });
    }
    deleteUserRoleMappingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.deleteUserRoleMappingsByUserId(userId);
        });
    }
    deleteUserRoleMappingByUserIdAndRoleId(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRoleMappingRepository.deleteUserRoleMappingByUserIdAndRoleId(userId, roleId);
        });
    }
}
exports.UserRoleMappingService = UserRoleMappingService;
