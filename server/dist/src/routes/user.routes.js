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
exports.userRoutes = void 0;
const controllers_1 = require("../controllers");
function userRoutes(fastifyServer) {
    return __awaiter(this, void 0, void 0, function* () {
        fastifyServer.post("/", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.postUser(request, reply);
            //   reply.code(200);
        }));
        fastifyServer.delete("/", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.deleteUser(request, reply);
            //   reply.code(200);
        }));
        fastifyServer.put("/", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            yield controllers_1.userController.putUser(request, reply);
            //   reply.code(200);
        }));
    });
}
exports.userRoutes = userRoutes;
