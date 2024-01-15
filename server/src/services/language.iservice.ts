import { Language, LanguageCreationAttributes } from "../models/language.model";

export interface ILanguageService {
  getLanguageById(languageId: string): Promise<Language | undefined>;

  createLanguage(
    languageCreationAttributes: LanguageCreationAttributes
  ): Promise<Language | undefined>;
}
