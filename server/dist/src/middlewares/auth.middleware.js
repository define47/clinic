"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
const authenticationMiddleware = (request, reply, done) => {
    //   console.log(request);
    var _a;
    const signedCookie = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.sessionId;
    if (!signedCookie &&
        request.url !== "/api/auth/login" &&
        request.url !== "/blocking" &&
        request.url !== "/non-blocking")
        return reply.code(401).send({ message: "No cookie" });
    const signedCookieValue = signedCookie
        ? request.unsignCookie(signedCookie)
        : null;
    //   console.log("sessionId:", signedCookieValue);
    if (!(signedCookieValue === null || signedCookieValue === void 0 ? void 0 : signedCookieValue.valid) &&
        request.url !== "/api/auth/login" &&
        request.url !== "/blocking" &&
        request.url !== "/non-blocking") {
        return reply.code(401).send({ message: "Unauthorized: Token not good" });
    }
    //   console.log(signedCookie);
    request.cookieData = signedCookieValue;
    done();
};
exports.authenticationMiddleware = authenticationMiddleware;
