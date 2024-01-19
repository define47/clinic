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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyServer = exports.MESSAGE_CHANNEL = void 0;
const env_1 = __importDefault(require("@fastify/env"));
const fastify_1 = __importDefault(require("fastify"));
const redis_1 = __importDefault(require("@fastify/redis"));
const node_cluster_1 = __importDefault(require("node:cluster"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_js_1 = require("./utils/dotenv.js");
const drizzle_js_1 = require("./utils/drizzle.js");
const base_repository_js_1 = require("./repositories/base.repository.js");
const user_model_js_1 = require("./models/user.model.js");
const user_routes_js_1 = require("./routes/user.routes.js");
const appointment_routes_js_1 = require("./routes/appointment.routes.js");
const medicalRecordPatient_routes_js_1 = require("./routes/medicalRecordPatient.routes.js");
const auth_routes_js_1 = require("./routes/auth.routes.js");
const auth_middleware_js_1 = require("./middlewares/auth.middleware.js");
const fastify_socket_io_1 = __importDefault(require("fastify-socket.io"));
const userPreferences_routes_js_1 = require("./routes/userPreferences.routes.js");
const userTest_js_1 = require("./__tests__/userTest.js");
const redisChannel = "socketChannel";
const countChannel = "countChannel";
const CONNECTION_COUNT_CHANNEL = "chat:connection-count-updated";
// const countChannelKey = "chat-connection-count";
exports.MESSAGE_CHANNEL = "chat:message-channel";
exports.fastifyServer = (0, fastify_1.default)({
// logger: true,
});
exports.fastifyServer.post("/broadcast-message", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { redis } = exports.fastifyServer;
    const body = request.body;
    // Publish the message to the message channel
    yield redis.publisher.publish(exports.MESSAGE_CHANNEL, body.message);
    return { status: "Message sent successfully" };
}));
const buildServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const corsOptions = {
        origin: "*",
        // origin: "http://192.168.2.16:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    };
    // const socketIOOptions = {
    //   // origin: "*",
    //   origin: "http://192.168.2.16:3000",
    //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // };
    yield exports.fastifyServer.register(cors_1.default, corsOptions);
    yield exports.fastifyServer.register(env_1.default, dotenv_js_1.options);
    yield exports.fastifyServer
        .register(redis_1.default, {
        host: "127.0.0.1",
        // password: "your strong password here",
        port: 6379,
        family: 4,
        namespace: "sessionRedis",
    })
        .register(redis_1.default, {
        host: "127.0.0.1",
        // password: "your strong password here",
        port: 6379,
        family: 4,
        namespace: "publisher",
    })
        .register(redis_1.default, {
        host: "127.0.0.1",
        // password: "your strong password here",
        port: 6379,
        family: 4,
        namespace: "subscriber",
    });
    yield exports.fastifyServer.register(cookie_1.default, {
        secret: "my-secret", // for cookies signature
        parseOptions: {}, // options for parsing cookies
    });
    yield exports.fastifyServer.register(fastify_socket_io_1.default, {
        cors: {
            origin: "http://192.168.2.16:3000",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });
    exports.fastifyServer.addHook("onRequest", auth_middleware_js_1.authenticationMiddleware);
    yield exports.fastifyServer.register(auth_routes_js_1.authRoutes, { prefix: "api/auth" });
    yield exports.fastifyServer.register(user_routes_js_1.userRoutes, { prefix: "api/users" });
    yield exports.fastifyServer.register(appointment_routes_js_1.appointmentRoutes, {
        prefix: "api/appointments",
    });
    yield exports.fastifyServer.register(medicalRecordPatient_routes_js_1.medicalRecordPatientRoutes, {
        prefix: "api/medicalRecordsPatients",
    });
    yield exports.fastifyServer.register(userPreferences_routes_js_1.userPreferencesRoutes, {
        prefix: "api/user-preferences",
    });
    yield exports.fastifyServer;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * sockets
    const { redis } = exports.fastifyServer;
    exports.fastifyServer.io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log(`[server#${(_a = node_cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.id}]: Client Connected via [server#${(_b = node_cluster_1.default.worker) === null || _b === void 0 ? void 0 : _b.id}]:`);
        const ioHandshake = socket.handshake;
        // console.log(`User connected with ID: ${JSON.stringify(ioHandshake)}`);
        // connectedClients++;
        // console.log(connectedClients);
        // await redis.publisher.publish(
        //   CONNECTION_COUNT_UPDATED_CHANNEL,
        //   String(connectedClients)
        // );
        socket.emit("welcome", "A warm welcome from the server!");
        redis.subscriber.subscribe(exports.MESSAGE_CHANNEL, (err) => {
            var _a, _b;
            if (err) {
                console.error("Error subscribing to channel:", err);
                return;
            }
            console.log(`[server#${(_a = node_cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.id}]: Client Subscribed to ${exports.MESSAGE_CHANNEL} via [server#${(_b = node_cluster_1.default.worker) === null || _b === void 0 ? void 0 : _b.id}]:`);
        });
        redis.subscriber.on("message", (channel, message) => {
            var _a, _b;
            console.log(`[client from server#${(_a = node_cluster_1.default.worker) === null || _a === void 0 ? void 0 : _a.id}]: Client Received message from ${channel}: ${message} through [server#${(_b = node_cluster_1.default.worker) === null || _b === void 0 ? void 0 : _b.id}]:`);
            socket.emit("message", message);
        });
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            console.log(`[server#${(_c = node_cluster_1.default.worker) === null || _c === void 0 ? void 0 : _c.id}]: Client Disconnected from server#${(_d = node_cluster_1.default.worker) === null || _d === void 0 ? void 0 : _d.id}:`);
        }));
    }));
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * /sockets
    exports.fastifyServer.get("/non-blocking", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const userRepo = new base_repository_js_1.BaseRepository(drizzle_js_1.drizzleInstance, user_model_js_1.userTable);
        const workerID = node_cluster_1.default.worker
            ? node_cluster_1.default.worker.id
            : "Not in cluster environment";
        console.log(`Request handled by worker #${workerID}`);
        return {
            hello: "world fastify",
            testUser: yield userRepo.getById("48631bef-8a77-51ca-b719-dfe17b719081"),
        };
    }));
    exports.fastifyServer.get("/blocking", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { redis } = exports.fastifyServer;
        let counter = 0;
        for (let i = 0; i < 4000000000; i++) {
            counter = counter + 1;
        }
        const workerID = node_cluster_1.default.worker
            ? node_cluster_1.default.worker.id
            : "Not in cluster environment";
        console.log(`Request handled by worker #${workerID}`);
        return { counter };
    }));
    // await migrateToDb();
    // await createRoles();
    // await createSpecialities();
    // const languageService = new LanguageService();
    // await languageService.createLanguage({
    //   languageName: "Romanian",
    //   languageCode: "ro",
    // });
    // await languageService.createLanguage({
    //   languageName: "English",
    //   languageCode: "en",
    // });
    // const userRoleMappingRepository = new UserRoleMappingRepository(
    //   drizzleInstance,
    //   userRoleMappingTable
    // );
    // const usersByRole = await userRoleMappingRepository.getAllUsersRelatedData(
    //   getDoctorRoleIdEnv(),
    //   ["userForename", "userSurname"],
    //   "",
    //   10,
    //   0,
    //   "medicalSpecialityName"
    // );
    // console.log(usersByRole?.usersRelatedData);
    // const medicalSpecialityRepository = new MedicalSpecialityRepository(
    //   drizzleInstance,
    //   medicalSpecialityTable
    // );
    // const medicalSpecialities =
    //   await medicalSpecialityRepository.getAllMedicalSpecialities("in", 5, 0);
    // console.log(medicalSpecialities?.medicalSpecialities);
    // await createUsers(50, "patient");
    // createUsers(0, 10, "doctor"updated);
    // createUsers(0, 10, "patient");
    // const appointmentRepository = new AppointmentRepository(
    //   drizzleInstance,
    //   appointmentTable
    // );
    // const appointments = await appointmentRepository.getAllAppointments(
    //   "doctor",
    //   ["userForename", "userSurname"],
    //   "",
    //   "nextWeek",
    //   // "appointmentDateTime"
    //   ["asc:userForename", "desc:userSurname"],
    //   3,
    //   0
    // );
    // console.log(appointments);
    // const userRoleMappingRepository = new UserRoleMappingRepository(
    //   drizzleInstance,
    //   userRoleMappingTable
    // );
    // const usersData = await userRoleMappingRepository.getAllUsersRelatedData(
    //   getPatientRoleIdEnv(),
    //   ["userForename"],
    //   "",
    //   100,
    //   0,
    //   "asc:userForename"
    // );
    // console.log(usersData?.usersRelatedData);
    yield (0, userTest_js_1.testUser)();
    // createDoctors();
    // createPatients();
    // await createAppointments(3, "2024", "01", "18");
    return exports.fastifyServer;
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fastifyServer = yield buildServer();
            const fastifyServerIPAddress = (0, dotenv_js_1.getServerIPAddressEnv)();
            const fastifyServerPort = (0, dotenv_js_1.getServerPortEnv)();
            console.log(`Listening at http://${fastifyServerIPAddress}:${fastifyServerPort}`);
            yield fastifyServer.listen({
                port: fastifyServerPort,
                host: fastifyServerIPAddress,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
// const numClusterWorkers = 4;
// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   for (let i = 0; i < numClusterWorkers; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) =>
//     console.log(`worker ${worker.process.pid} died`)
//   );
//   cluster.on("online", (worker) => {
//     console.log(
//       `Yay, the worker ${worker.process.pid} responded after it was forked`
//     );
//   });
// } else {
//   try {
//     main();
//   } catch (error) {
//     console.log(error);
//   }
// }
