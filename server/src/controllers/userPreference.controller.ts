import { FastifyReply, FastifyRequest } from "fastify";
import { UserPreferencesMappingService } from "../services/userPreferencesMapping.service";
import { fastifyServer } from "../server";
import clc from "cli-color";
import { LanguageService } from "../services/language.service";
import { v4 as uuidv4 } from "uuid";

export class UserPreferencesController {
  private readonly _userPreferencesMappingService: UserPreferencesMappingService;
  private readonly _languageService: LanguageService;

  public constructor() {
    this._userPreferencesMappingService = new UserPreferencesMappingService();
    this._languageService = new LanguageService();
  }

  public putUserPreferencesMapping = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;
      const { redis } = fastifyServer;
      const currentCookie = request.cookieData;
      const currentSessionValue = JSON.parse(
        (await redis.sessionRedis.get(`sessionId:${currentCookie.value}`)) ??
          "null"
      );

      const currentUserPreferencesMapping =
        await this._userPreferencesMappingService.getUserPreferencesMappingByUserId(
          currentSessionValue.userId
        );

      const newLanguage = await this._languageService.getLanguageById(
        body.languageId
      );

      await this._userPreferencesMappingService.updateUserPreferencesMapping(
        currentSessionValue.userId,
        {
          languageId: newLanguage?.languageId!,
          isDarkModeOn: body.isDarkModeOn,
        }
      );

      console.log(
        clc.red(`current Session Id: ${JSON.stringify(currentCookie)}`)
      );

      console.log(
        "currentUserPreferencesMapping",
        currentUserPreferencesMapping
      );

      console.log(currentSessionValue.userId);

      const sessionId = uuidv4();
      const sessionValue = {
        userId: currentSessionValue?.userId,
        userForename: currentSessionValue?.userForename,
        userSurname: currentSessionValue?.userSurname,
        userEmail: currentSessionValue?.userEmail,
        roles: currentSessionValue.roles,
        specialities: currentSessionValue.specialities,
        languageCode: newLanguage?.languageCode,
        languageName: newLanguage?.languageName,
        isDarkModeOn: body.isDarkModeOn,
      };

      console.log(sessionValue);

      console.log(`${clc.cyan("created session:")} get sessionId:${sessionId}`);

      await redis.sessionRedis.set(
        `sessionId:${sessionId}`,
        // `${userToLogin?.userForename} ${userToLogin?.userSurname} (${userToLogin?.userEmail})`
        JSON.stringify(sessionValue)
      );

      reply.setCookie("sessionId", sessionId, {
        signed: true,
        domain: "192.168.2.16",
        path: "/",
        expires: new Date(Date.now() + 80_400_000),
      });

      await redis.sessionRedis.del(`sessionId:${request.cookieData.value}`);
      reply.code(200).send({});
    } catch (error) {
      console.log(error);
    }
  };
}
