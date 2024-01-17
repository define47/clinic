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
exports.LanguageService = void 0;
const language_model_1 = require("../models/language.model");
const language_repository_1 = require("../repositories/language.repository");
const drizzle_1 = require("../utils/drizzle");
class LanguageService {
    constructor() {
        this._languageRepository = new language_repository_1.LanguageRepository(drizzle_1.drizzleInstance, language_model_1.languageTable);
    }
    getLanguageById(languageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._languageRepository.getLanguageById(languageId);
        });
    }
    createLanguage(languageCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._languageRepository.createLanguage(languageCreationAttributes);
        });
    }
}
exports.LanguageService = LanguageService;
