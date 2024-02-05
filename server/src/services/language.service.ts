import {
  Language,
  LanguageCreationAttributes,
  languageTable,
} from "../models/language.model";
import { LanguageRepository } from "../repositories/language.repository";
import { drizzleInstance } from "../utils/drizzle";
import { ILanguageService } from "./language.iservice";

export class LanguageService implements ILanguageService {
  private readonly _languageRepository: LanguageRepository;

  public constructor() {
    this._languageRepository = new LanguageRepository(
      drizzleInstance,
      languageTable
    );
  }

  public async getLanguageById(
    languageId: string
  ): Promise<Language | undefined> {
    return this._languageRepository.getLanguageById(languageId);
  }

  public async getLanguageByName(languageName: string) {
    return await this._languageRepository.getLanguageByName(languageName);
  }

  public async createLanguage(
    languageCreationAttributes: LanguageCreationAttributes
  ): Promise<Language | undefined> {
    return this._languageRepository.createLanguage(languageCreationAttributes);
  }
}
