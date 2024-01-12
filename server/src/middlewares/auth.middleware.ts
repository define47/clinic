import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    sessionId?: any;
  }
}

export const authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: any
) => {
  //   console.log(request);

  const signedCookie = request.cookies?.sessionId;

  if (!signedCookie && request.url !== "/api/auth/login")
    return reply.code(401).send({ message: "No cookie" });

  const signedCookieValue = signedCookie
    ? request.unsignCookie(signedCookie)
    : null;

  //   console.log("sessionId:", signedCookieValue);

  if (!signedCookieValue?.valid && request.url !== "/api/auth/login") {
    return reply.code(401).send({ message: "Unauthorized: Token not good" });
  }
  //   console.log(signedCookie);
  request.sessionId = signedCookieValue;
  done();
};
