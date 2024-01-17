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
exports.RoleService = void 0;
const role_model_1 = require("../models/role.model");
const role_repository_1 = require("../repositories/role.repository");
const drizzle_1 = require("../utils/drizzle");
class RoleService {
    constructor() {
        this._roleRepository = new role_repository_1.RoleRepository(drizzle_1.drizzleInstance, role_model_1.roleTable);
    }
    getRoleById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._roleRepository.getRoleById(roleId);
        });
    }
    getRoleByName(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._roleRepository.getRoleByName(roleName);
        });
    }
    createRole(roleCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._roleRepository.createRole(roleCreationAttributes);
        });
    }
}
exports.RoleService = RoleService;
