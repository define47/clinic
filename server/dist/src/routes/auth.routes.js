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
exports.authRoutes = void 0;
const controllers_1 = require("../controllers");
function authRoutes(fastifyServer) {
    return __awaiter(this, void 0, void 0, function* () {
        fastifyServer.post("/login", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.loginUser(request, reply);
        }));
        fastifyServer.get("/read-signed-cookie", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.verifyUser(request, reply);
        }));
        fastifyServer.post("/logout", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.logoutUser(request, reply);
        }));
    });
}
exports.authRoutes = authRoutes;
