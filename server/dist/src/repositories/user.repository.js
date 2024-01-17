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
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getById(userId);
        });
    }
    getUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByAttribute("userEmail", userEmail);
        });
    }
    getUserByPhoneNumber(userPhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getByAttribute("userPhoneNumber", userPhoneNumber);
        });
    }
    createUser(userCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(userCreationAttributes);
        });
    }
    updateUser(userId, userUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(userId, userUpdateAttributes);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(userId);
        });
    }
}
exports.UserRepository = UserRepository;
