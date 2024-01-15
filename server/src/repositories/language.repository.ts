import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Language, LanguageCreationAttributes } from "../models/language.model";
import { BaseRepository } from "./base.repository";
import { ILanguageRepository } from "./language.irepository";
import { Table } from "drizzle-orm";

export class LanguageRepository
  extends BaseRepository<Language>
  implements ILanguageRepository
{
  public constructor(
    drizzle: NodePgDatabase<Record<string, never>>,
    table: Table<any>
  ) {
    super(drizzle, table);
  }

  public async getLanguageById(
    languageId: string
  ): Promise<Language | undefined> {
    return await this.getById(languageId);
  }

  public async createLanguage(
    languageCreationAttributes: LanguageCreationAttributes
  ): Promise<Language | undefined> {
    return await this.create(languageCreationAttributes);
  }
}
