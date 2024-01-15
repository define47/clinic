import { Language, LanguageCreationAttributes } from "../models/language.model";
import { IBaseRepository } from "./base.irepository";

export interface ILanguageRepository extends IBaseRepository<Language> {
  getLanguageById(languageId: string): Promise<Language | undefined>;

  createLanguage(
    languageCreationAttributes: LanguageCreationAttributes
  ): Promise<Language | undefined>;
}
