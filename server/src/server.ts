import fastifyEnv from "@fastify/env";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyRedis from "@fastify/redis";
import cluster from "node:cluster";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getDoctorRoleIdEnv,
  getPatientRoleIdEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { drizzleInstance, migrateToDb } from "./utils/drizzle.js";
import { BaseRepository } from "./repositories/base.repository.js";
import { User, userTable } from "./models/user.model.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";
import fastifySocketIO from "fastify-socket.io";

import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";
import { medicalRecordPatientRoutes } from "./routes/medicalRecordPatient.routes.js";
import { userPreferencesRoutes } from "./routes/userPreferences.routes.js";
import { medicalSpecialityRoutes } from "./routes/medicalSpeciality.routes.js";
import { medicalProcedureRoutes } from "./routes/medicalProcedure.routes.js";
import { appointmentHistoryRoutes } from "./routes/appointmentHistory.routes.js";
import { appointmentDoctorBookedSlotsRoutes } from "./routes/appointmentDoctorAvailability.routes.js";
import {
  createAppointments,
  createLanguages,
  createPatients,
  createRoles,
  createSpecialities,
  createUser,
  deleteUser,
  performAdminInteractions,
  performDoctorInteractions,
  updateUser,
} from "./utils/databaseInteractions.js";
import { generalDataRoutes } from "./routes/generalData.routes.js";

const redisChannel = "socketChannel";
const countChannel = "countChannel";
const CONNECTION_COUNT_CHANNEL = "chat:connection-count-updated";
// const countChannelKey = "chat-connection-count";
export const MESSAGE_CHANNEL = "chat:message-channel";

// import { SerialPort } from "serialport";

// SerialPort.list().then(function (ports) {
//   ports.forEach(function (port) {
//     console.log("Port: ", port);
//   });
// });

declare module "fastify" {
  interface FastifyInstance {
    config: {
      SERVER_PORT: number;
      SERVER_IP_ADDRESS: string;
      UUID_V5_NAMESPACE: string;
      DATABASE_HOST: string;
      DATABASE_PORT: number;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_SCHEMA: string;
      REACT_CLIENT_PORT: number;
      REACT_CLIENT_IP_ADDRESS: string;
      ADMIN_ROLE_ID: string;
      DOCTOR_ROLE_ID: string;
      RECEPTIONIST_ROLE_ID: string;
      PATIENT_ROLE_ID: string;
    };
    io: any;
  }
}

export const fastifyServer = Fastify({
  // logger: true,
});

fastifyServer.post("/broadcast-message", async (request, reply) => {
  const { redis } = fastifyServer;
  const body: any = request.body;

  // Publish the message to the message channel
  await redis.publisher.publish(MESSAGE_CHANNEL, body.message);

  return { status: "Message sent successfully" };
});

const buildServer = async () => {
  const corsOptions = {
    // origin: "*",
    origin: `http://192.168.2.13:3000`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  };

  // const socketIOOptions = {
  //   // origin: "*",
  //   origin: "http://192.168.2.16:3000",
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // };

  await fastifyServer.register(fastifyEnv, options);

  await fastifyServer.register(fastifyCors, corsOptions);

  await fastifyServer
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "sessionRedis",
    })
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "publisher",
    })
    .register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379,
      family: 4,
      namespace: "subscriber",
    });

  await fastifyServer.register(cookie, {
    secret: "my-secret", // for cookies signature
    parseOptions: {}, // options for parsing cookies
  } as FastifyCookieOptions);

  await fastifyServer.register(fastifySocketIO, {
    cors: {
      origin: "http://192.168.2.16:3000",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  fastifyServer.addHook("onRequest", authenticationMiddleware);

  await fastifyServer.register(authRoutes, { prefix: "api/auth" });

  await fastifyServer.register(userRoutes, { prefix: "api/users" });

  await fastifyServer.register(medicalSpecialityRoutes, {
    prefix: "api/medical-specialities",
  });

  await fastifyServer.register(medicalProcedureRoutes, {
    prefix: "api/medical-procedures",
  });

  await fastifyServer.register(appointmentRoutes, {
    prefix: "api/appointments",
  });

  await fastifyServer.register(medicalRecordPatientRoutes, {
    prefix: "api/medicalRecordsPatients",
  });

  await fastifyServer.register(userPreferencesRoutes, {
    prefix: "api/user-preferences",
  });

  await fastifyServer.register(appointmentHistoryRoutes, {
    prefix: "api/appointments-history",
  });

  await fastifyServer.register(appointmentDoctorBookedSlotsRoutes, {
    prefix: "api/doctor-appointment-booked-slots",
  });

  await fastifyServer.register(generalDataRoutes, {
    prefix: "api/general-data",
  });

  await fastifyServer;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * sockets

  const { redis } = fastifyServer;

  fastifyServer.io.on("connection", async (socket: any) => {
    console.log(
      `[server#${cluster.worker?.id}]: Client Connected via [server#${cluster.worker?.id}]:`
    );
    const ioHandshake = socket.handshake;

    // console.log(`User connected with ID: ${JSON.stringify(ioHandshake)}`);
    // connectedClients++;
    // console.log(connectedClients);

    // await redis.publisher.publish(
    //   CONNECTION_COUNT_UPDATED_CHANNEL,
    //   String(connectedClients)
    // );

    socket.emit(
      "welcome",
      JSON.stringify({ message: "A warm welcome from the server!" })
    );

    redis.subscriber.subscribe(MESSAGE_CHANNEL, (err) => {
      if (err) {
        console.error("Error subscribing to channel:", err);
        return;
      }
      console.log(
        `[server#${cluster.worker?.id}]: Client Subscribed to ${MESSAGE_CHANNEL} via [server#${cluster.worker?.id}]:`
      );
    });

    redis.subscriber.on("message", (channel, message) => {
      console.log(
        `[client from server#${cluster.worker?.id}]: Client Received message from ${channel}: ${message} through [server#${cluster.worker?.id}]:`
      );
      socket.emit("message", message);
    });

    socket.on("disconnect", async () => {
      console.log(
        `[server#${cluster.worker?.id}]: Client Disconnected from server#${cluster.worker?.id}:`
      );
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// * /sockets

  fastifyServer.get("/non-blocking", async (request, reply) => {
    const userRepo = new BaseRepository(drizzleInstance, userTable);

    const workerID = cluster.worker
      ? cluster.worker.id
      : "Not in cluster environment";

    console.log(`Request handled by worker #${workerID}`);
    return {
      hello: "world fastify",
      testUser: await userRepo.getById("48631bef-8a77-51ca-b719-dfe17b719081"),
    };
  });

  fastifyServer.get("/blocking", async (request, reply) => {
    const { redis } = fastifyServer;
    let counter = 0;
    for (let i = 0; i < 4_000_000_000; i++) {
      counter = counter + 1;
    }

    const workerID = cluster.worker
      ? cluster.worker.id
      : "Not in cluster environment";

    console.log(`Request handled by worker #${workerID}`);

    return { counter };
  });

  // await migrateToDb();
  // await createRoles();
  // await createSpecialities();
  // await createLanguages();

  // performAdminInteractions();
  // performDoctorInteractions(true);
  // createPatients(0, 100);

  // await createAppointments(0, 150);

  return fastifyServer;
};

async function main() {
  try {
    const fastifyServer = await buildServer();

    const fastifyServerIPAddress = getServerIPAddressEnv();
    const fastifyServerPort = getServerPortEnv();

    console.log(
      `Listening at http://${fastifyServerIPAddress}:${fastifyServerPort}`
    );

    await fastifyServer.listen({
      port: fastifyServerPort,
      host: fastifyServerIPAddress,
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// const numClusterWorkers = 8;
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
