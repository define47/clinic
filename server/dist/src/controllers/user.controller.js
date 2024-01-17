"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserController = void 0;
const argon2 = __importStar(require("argon2"));
const uuid_1 = require("uuid");
const clc = __importStar(require("cli-color"));
const role_service_1 = require("../services/role.service");
const user_service_1 = require("../services/user.service");
const userRoleMapping_service_1 = require("../services/userRoleMapping.service");
const doctorMedicalSpecialityMapping_service_1 = require("../services/doctorMedicalSpecialityMapping.service");
const medicalSpeciality_service_1 = require("../services/medicalSpeciality.service");
const dotenv_1 = require("../utils/dotenv");
const server_1 = require("../server");
const language_service_1 = require("../services/language.service");
const userPreferencesMapping_service_1 = require("../services/userPreferencesMapping.service");
class UserController {
    constructor() {
        this.checkUserEmailValidity = (userEmail) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userService.getUserByEmail(userEmail);
            if (!user)
                return true;
            return false;
        });
        this.checkUserPhoneNumberValidity = (userPhoneNumber) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userService.getUserByPhoneNumber(userPhoneNumber);
            if (!user)
                return true;
            return false;
        });
        this.logoutUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { redis } = server_1.fastifyServer;
                console.log("sessionId logout", request.cookieData.value);
                yield redis.sessionRedis.del(`sessionId:${request.cookieData.value}`);
                reply.clearCookie("sessionId");
                reply.code(200).send({ success: true, message: "logged out" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.verifyUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const signedCookieValue = request.unsignCookie(request.cookies.userSession);
                console.log("reading", request.cookieData);
                reply
                    .code(200)
                    .send(`Signed Cookie Value:  ${JSON.stringify(signedCookieValue)}`);
            }
            catch (error) { }
        });
        this.loginUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const body = request.body;
                // console.log(body);
                const userToLogin = yield this._userService.getUserByEmail(body.userEmail);
                if (!userToLogin)
                    reply.code(200).send({ success: false, message: "Failed Login email" });
                const passwordsMatch = yield argon2.verify(userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userEncryptedPassword, body.userPassword);
                if (!passwordsMatch)
                    reply
                        .code(200)
                        .send({ success: false, message: "Failed Login password" });
                const { redis } = server_1.fastifyServer;
                const userPreferencesMapping = yield this._userPreferencesMappingService.getUserPreferencesMappingByUserId(userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userId);
                console.log(userPreferencesMapping === undefined);
                if (userPreferencesMapping === undefined) {
                    const romanianLanguage = yield this._languageService.getLanguageById("197a489f-c736-5974-a13e-7c12db1729b8");
                    console.log(romanianLanguage);
                    yield this._userPreferencesMappingService.createUserPreferencesMapping({
                        userId: userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userId,
                        languageId: romanianLanguage === null || romanianLanguage === void 0 ? void 0 : romanianLanguage.languageId,
                        isDarkModeOn: false,
                    });
                }
                const language = yield this._languageService.getLanguageById(userPreferencesMapping === null || userPreferencesMapping === void 0 ? void 0 : userPreferencesMapping.languageId);
                console.log(language);
                let userRoleNames = [];
                const userToLoginRoles = yield this._userRoleMappingService.getUserRoleMappingsByUserId(userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userId);
                for (let i = 0; i < userToLoginRoles.length; i++) {
                    userRoleNames.push((_a = (yield this._roleService.getRoleById(userToLoginRoles[i].roleId))) === null || _a === void 0 ? void 0 : _a.roleName);
                }
                let doctorSpecialityNames = [];
                if (userRoleNames[0] === "doctor" || userRoleNames[1] === "doctor") {
                    const userToLoginSpecialities = yield this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userId);
                    for (let i = 0; i < userToLoginSpecialities.length; i++) {
                        doctorSpecialityNames.push((_b = (yield this._medicalSpecialityService.getMedicalSpecialityById(userToLoginSpecialities[i].medicalSpecialityId))) === null || _b === void 0 ? void 0 : _b.medicalSpecialityName);
                    }
                }
                const sessionId = (0, uuid_1.v4)();
                const sessionValue = {
                    userId: userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userId,
                    userForename: userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userForename,
                    userSurname: userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userSurname,
                    userEmail: userToLogin === null || userToLogin === void 0 ? void 0 : userToLogin.userEmail,
                    roles: userRoleNames,
                    specialities: doctorSpecialityNames,
                    languageCode: language === null || language === void 0 ? void 0 : language.languageCode,
                    languageName: language === null || language === void 0 ? void 0 : language.languageName,
                    isDarkModeOn: userPreferencesMapping === null || userPreferencesMapping === void 0 ? void 0 : userPreferencesMapping.isDarkModeOn,
                };
                console.log(sessionValue);
                console.log(`${clc.cyan("created session:")} get sessionId:${sessionId}`);
                yield redis.sessionRedis.set(`sessionId:${sessionId}`, 
                // `${userToLogin?.userForename} ${userToLogin?.userSurname} (${userToLogin?.userEmail})`
                JSON.stringify(sessionValue));
                reply.setCookie("sessionId", sessionId, {
                    signed: true,
                    domain: "192.168.2.16",
                    path: "/",
                    expires: new Date(Date.now() + 80400000),
                });
                yield redis.publisher.publish(server_1.MESSAGE_CHANNEL, `a user (${body.userEmail}) has logged in`);
                reply.code(200).send({
                    success: true,
                    message: "login successful",
                    userRoles: userToLoginRoles,
                    userPreferencesMapping,
                });
            }
            catch (error) { }
        });
        this.postUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                if (body.action === "createUser") {
                    const roleNames = body.roleNames;
                    for (let i = 0; i < roleNames.length; i++) {
                        const role = yield this._roleService.getRoleByName(roleNames[i]);
                        if (!role)
                            return reply.code(200).send({
                                success: false,
                                message: `role ${roleNames[i]} not found`,
                            });
                    }
                    const isUserEmailValid = yield this.checkUserEmailValidity(body.userEmail);
                    const isUserPhoneNumberValid = yield this.checkUserPhoneNumberValidity(body.userPhoneNumber);
                    if (!isUserEmailValid)
                        reply.code(200).send({ success: false });
                    if (!isUserPhoneNumberValid)
                        reply.code(200).send({ success: false });
                    let postUser = yield this._userService.createUser({
                        userForename: body.userForename,
                        userSurname: body.userSurname,
                        userEmail: body.userEmail,
                        userPhoneNumber: body.userPhoneNumber,
                        userDateOfBirth: body.userDateOfBirth,
                        userAddress: body.userAddress,
                        userGender: body.userGender,
                        userEncryptedPassword: yield argon2.hash(body.userEncryptedPassword),
                    });
                    postUser = postUser;
                    for (let i = 0; i < roleNames.length; i++) {
                        const role = yield this._roleService.getRoleByName(roleNames[i]);
                        yield this._userRoleMappingService.createUserRoleMapping({
                            userId: postUser.userId,
                            roleId: role === null || role === void 0 ? void 0 : role.roleId,
                        });
                        if ((role === null || role === void 0 ? void 0 : role.roleName) === "doctor") {
                            const specialityNames = body.specialityNames;
                            for (let j = 0; j < specialityNames.length; j++) {
                                const currentSpeciality = yield this._medicalSpecialityService.getMedicalSpecialityByName(specialityNames[j]);
                                yield this._doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping({
                                    doctorId: postUser.userId,
                                    medicalSpecialityId: currentSpeciality === null || currentSpeciality === void 0 ? void 0 : currentSpeciality.medicalSpecialityId,
                                    isPrimaryMedicalSpeciality: j === 0,
                                    isSecondaryMedicalSpeciality: j === 1,
                                    isTertiaryMedicalSpeciality: j === 2,
                                });
                            }
                        }
                    }
                    const { redis } = server_1.fastifyServer;
                    yield redis.publisher.publish(server_1.MESSAGE_CHANNEL, JSON.stringify(postUser));
                    return reply
                        .code(200)
                        .send({ success: postUser !== undefined, message: "" });
                }
                else if (body.action === "getUsers") {
                }
            }
            catch (error) {
                console.log(error);
                return reply.code(400).send({ error: error.message });
            }
        });
        this.putUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            try {
                const body = request.body;
                const { redis } = server_1.fastifyServer;
                const userSessionData = yield redis.sessionRedis.get(`sessionId:${request.cookieData.value}`);
                const putUser = yield this._userService.updateUser(body.userId, {
                    userForename: body.userForename,
                    userSurname: body.userSurname,
                    userEmail: body.userEmail,
                    userPhoneNumber: body.userPhoneNumber,
                    userDateOfBirth: body.userDateOfBirth,
                    userAddress: body.userAddress,
                    userGender: body.userGender,
                    userUpdatedAt: new Date(),
                });
                if (body.specialityNames) {
                    const specialityNames = body.specialityNames;
                    const currentDoctorSpecialities = yield this._doctorSpecialityMappingService.getDoctorMedicalSpecialityMappingsByDoctorId(putUser === null || putUser === void 0 ? void 0 : putUser.userId);
                    console.log(putUser);
                    for (let i = 0; i < specialityNames.length; i++) {
                        const currentSpecialityToUpdateTo = yield this._medicalSpecialityService.getMedicalSpecialityByName(specialityNames[i]);
                        if (currentDoctorSpecialities &&
                            currentDoctorSpecialities[i].medicalSpecialityId !==
                                (currentSpecialityToUpdateTo === null || currentSpecialityToUpdateTo === void 0 ? void 0 : currentSpecialityToUpdateTo.medicalSpecialityId)) {
                            yield this._doctorSpecialityMappingService.updateDoctorMedicalSpecialityMapping(putUser === null || putUser === void 0 ? void 0 : putUser.userId, (_c = currentDoctorSpecialities[i]) === null || _c === void 0 ? void 0 : _c.medicalSpecialityId, currentSpecialityToUpdateTo === null || currentSpecialityToUpdateTo === void 0 ? void 0 : currentSpecialityToUpdateTo.medicalSpecialityId, i === 0, i === 1, i === 2);
                        }
                    }
                }
                return reply
                    .code(200)
                    .send({ success: putUser !== undefined, message: "", userSessionData });
            }
            catch (error) {
                console.log(error);
                return reply.code(400).send({ error: error.message });
            }
        });
        this.deleteUser = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                let user = yield this._userService.getUserById(body.userId);
                let userRoleMappings = (yield this._userRoleMappingService.getUserRoleMappingsByUserId(body.userId));
                for (let i = 0; i < userRoleMappings.length; i++) {
                    if (userRoleMappings[i].roleId === (0, dotenv_1.getDoctorRoleIdEnv)()) {
                        yield this._doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingsByDoctorId(user === null || user === void 0 ? void 0 : user.userId);
                        break;
                    }
                }
                yield this._userRoleMappingService.deleteUserRoleMappingsByUserId(user === null || user === void 0 ? void 0 : user.userId);
                yield this._userService.deleteUser(user === null || user === void 0 ? void 0 : user.userId);
                return reply.code(200).send({ success: true, message: "" });
                // const userRoleMappings = await this._userRoleMappingService.getUserRoleMappingsByUserId(user?.userId!)
                // for (let i = 0; i < userRoleMappings!.length; i++) {
                //     await this._userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId
                // }
            }
            catch (error) { }
        });
        this._userService = new user_service_1.UserService();
        this._roleService = new role_service_1.RoleService();
        this._userRoleMappingService = new userRoleMapping_service_1.UserRoleMappingService();
        this._doctorSpecialityMappingService =
            new doctorMedicalSpecialityMapping_service_1.DoctorMedicalSpecialityMappingService();
        this._medicalSpecialityService = new medicalSpeciality_service_1.MedicalSpecialityService();
        this._languageService = new language_service_1.LanguageService();
        this._userPreferencesMappingService = new userPreferencesMapping_service_1.UserPreferencesMappingService();
    }
}
exports.UserController = UserController;
