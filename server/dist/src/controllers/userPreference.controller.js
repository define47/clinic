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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesController = void 0;
const userPreferencesMapping_service_1 = require("../services/userPreferencesMapping.service");
const server_1 = require("../server");
const cli_color_1 = __importDefault(require("cli-color"));
const language_service_1 = require("../services/language.service");
const uuid_1 = require("uuid");
class UserPreferencesController {
    constructor() {
        this.putUserPreferencesMapping = (request, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const body = request.body;
                const { redis } = server_1.fastifyServer;
                const currentCookie = request.cookieData;
                const currentSessionValue = JSON.parse((_a = (yield redis.sessionRedis.get(`sessionId:${currentCookie.value}`))) !== null && _a !== void 0 ? _a : "null");
                const currentUserPreferencesMapping = yield this._userPreferencesMappingService.getUserPreferencesMappingByUserId(currentSessionValue.userId);
                const newLanguage = yield this._languageService.getLanguageById(body.languageId);
                yield this._userPreferencesMappingService.updateUserPreferencesMapping(currentSessionValue.userId, {
                    languageId: newLanguage === null || newLanguage === void 0 ? void 0 : newLanguage.languageId,
                    isDarkModeOn: body.isDarkModeOn,
                });
                console.log(cli_color_1.default.red(`current Session Id: ${JSON.stringify(currentCookie)}`));
                console.log("currentUserPreferencesMapping", currentUserPreferencesMapping);
                console.log(currentSessionValue.userId);
                const sessionId = (0, uuid_1.v4)();
                const sessionValue = {
                    userId: currentSessionValue === null || currentSessionValue === void 0 ? void 0 : currentSessionValue.userId,
                    userForename: currentSessionValue === null || currentSessionValue === void 0 ? void 0 : currentSessionValue.userForename,
                    userSurname: currentSessionValue === null || currentSessionValue === void 0 ? void 0 : currentSessionValue.userSurname,
                    userEmail: currentSessionValue === null || currentSessionValue === void 0 ? void 0 : currentSessionValue.userEmail,
                    roles: currentSessionValue.roles,
                    specialities: currentSessionValue.specialities,
                    languageCode: newLanguage === null || newLanguage === void 0 ? void 0 : newLanguage.languageCode,
                    languageName: newLanguage === null || newLanguage === void 0 ? void 0 : newLanguage.languageName,
                    isDarkModeOn: body.isDarkModeOn,
                };
                console.log(sessionValue);
                console.log(`${cli_color_1.default.cyan("created session:")} get sessionId:${sessionId}`);
                yield redis.sessionRedis.set(`sessionId:${sessionId}`, 
                // `${userToLogin?.userForename} ${userToLogin?.userSurname} (${userToLogin?.userEmail})`
                JSON.stringify(sessionValue));
                reply.setCookie("sessionId", sessionId, {
                    signed: true,
                    domain: "192.168.2.16",
                    path: "/",
                    expires: new Date(Date.now() + 80400000),
                });
                yield redis.sessionRedis.del(`sessionId:${request.cookieData.value}`);
                reply.code(200).send({});
            }
            catch (error) {
                console.log(error);
            }
        });
        this._userPreferencesMappingService = new userPreferencesMapping_service_1.UserPreferencesMappingService();
        this._languageService = new language_service_1.LanguageService();
    }
}
exports.UserPreferencesController = UserPreferencesController;
