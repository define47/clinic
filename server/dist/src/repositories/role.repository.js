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
exports.RoleRepository = void 0;
const base_repository_1 = require("./base.repository");
class RoleRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getRoleById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getById(roleId);
        });
    }
    getRoleByName(roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByAttribute("roleName", roleName);
        });
    }
    createRole(roleCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(roleCreationAttributes);
        });
    }
}
exports.RoleRepository = RoleRepository;
