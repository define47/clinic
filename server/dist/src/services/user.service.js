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
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const user_repository_1 = require("../repositories/user.repository");
const drizzle_1 = require("../utils/drizzle");
class UserService {
    constructor() {
        this._userRepository = new user_repository_1.UserRepository(drizzle_1.drizzleInstance, user_model_1.userTable);
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getUserById(userId);
        });
    }
    getUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getUserByEmail(userEmail);
        });
    }
    getUserByPhoneNumber(userPhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._userRepository.getUserByPhoneNumber(userPhoneNumber);
        });
    }
    createUser(userCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.createUser(userCreationAttributes);
        });
    }
    updateUser(userId, userUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.updateUser(userId, userUpdateAttributes);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.deleteUser(userId);
        });
    }
}
exports.UserService = UserService;
