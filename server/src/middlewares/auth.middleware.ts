import { FastifyReply, FastifyRequest } from "fastify";
import { fastifyServer } from "../server";

declare module "fastify" {
  interface FastifyRequest {
    cookieData?: any;
    // {
    //   valid: boolean;
    //   renew: boolean;
    //   value: string;
    // };
    userData?: any;
  }
}

export const authenticationMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: any
) => {
  //   console.log(request);

  const signedCookie = request.cookies?.sessionId;
  // console.log(signedCookie);

  if (
    !signedCookie &&
    request.url !== "/api/auth/login" &&
    request.url !== "/blocking" &&
    request.url !== "/non-blocking"
  )
    return reply.code(200).send({ success: false, message: "No cookie" });

  const signedCookieValue = signedCookie
    ? request.unsignCookie(signedCookie)
    : null;

  // console.log("sessionId:", signedCookieValue);

  if (
    !signedCookieValue?.valid &&
    request.url !== "/api/auth/login" &&
    request.url !== "/blocking" &&
    request.url !== "/non-blocking"
  ) {
    return reply
      .code(200)
      .send({ success: false, message: "Unauthorized: Token not good" });
  }
  // console.log(signedCookie);
  request.cookieData = signedCookieValue;
  done();
};
