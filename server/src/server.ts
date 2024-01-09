import fastifyEnv from "@fastify/env";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyRedis from "@fastify/redis";
import cluster from "node:cluster";

import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getDoctorRoleIdEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { drizzleInstance, migrateToDb } from "./utils/drizzle.js";
import { BaseRepository } from "./repositories/base.repository.js";
import { User, userTable } from "./models/user.model.js";
import { roleTable } from "./models/role.model.js";
import { specialityTable } from "./models/speciality.model.js";
import { userRoleMappingTable } from "./models/userRoleMapping.model.js";
import { doctorSpecialityMappingTable } from "./models/doctorSpecialityMapping.model.js";
import fastifyCors from "@fastify/cors";
import { channel } from "node:diagnostics_channel";
import { UserRepository } from "./repositories/user.repository.js";
import {
  createDoctorSpecialityMapping,
  createRoles,
  createSpecialities,
  createUser,
  createUsers,
  deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId,
  deleteDoctorSpecialityMappingsByDoctorId,
  deleteUserRolesMappingById,
  getDoctorSpecialityMappings,
  getUserRoleMappings,
} from "./utils/databaseInteractions.js";

const redisChannel = "sseChannel";

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
  }
}

export const fastifyServer = Fastify({
  logger: true,
});

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
  for (let i = 0; i < 2_000_000_000; i++) {
    counter = counter + 1;
  }

  const workerID = cluster.worker
    ? cluster.worker.id
    : "Not in cluster environment";

  console.log(`Request handled by worker #${workerID}`);

  return { counter };
});

const corsOptions = {
  origin: "*",
};

// SSE
let clients: any[] = [];

function sendEventToClients(eventData: string) {
  clients.forEach((client) => {
    client.response.raw.write(`data: ${eventData}\n\n`);
  });
}

function eventsHandler(req: FastifyRequest, reply: FastifyReply) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": `http://192.168.2.16:3000`,
    "Access-Control-Expose-Headers": "*",
  };

  reply.raw.writeHead(200, headers);

  const clientId = req.id;

  const newClient = {
    id: clientId,
    response: reply,
  };

  clients.push(newClient);

  req.raw.on("close", () => {
    console.log(`${clientId} connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

fastifyServer.get("/sse", eventsHandler);

fastifyServer.post("/notify-clients", (req, reply) => {
  const eventData = JSON.stringify({
    type: "other",
    notification: "Button clicked! here",
  });
  sendEventToClients(eventData);
  reply.send("Notification sent to clients");
});

let counter = 0;

fastifyServer.get("/counter", (req, reply) => {
  const workerID = cluster.worker
    ? cluster.worker.id
    : "Not in cluster environment";

  console.log(`Request handled by worker #${workerID}`);

  const { redis } = fastifyServer;

  counter = counter + 1;

  const eventData = JSON.stringify({ type: "counter", counter });

  redis.publisher.publish(redisChannel, eventData, (err, reply) => {
    if (err) {
      console.error("Error publishing message:", err);
      return;
    }
    console.log(`Message published to ${redisChannel}: ${eventData}`);
  });

  sendEventToClients(eventData);

  reply.code(200).send("Notification sent successfully");
});
// /SSE

const startServer = async () => {
  fastifyServer.register(fastifyCors, corsOptions);
  fastifyServer.register(fastifyEnv, options);
  fastifyServer
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
  await fastifyServer;

  await migrateToDb();

  const { redis } = fastifyServer;

  // await createUser(
  //   "doctor1fn",
  //   "doctor1ln",
  //   "doctor1em",
  //   "doctor1ph",
  //   "1234-12-31",
  //   "male",
  //   "doctor1addr",
  //   "doctor1pass",
  //   true,
  //   true,
  //   true,
  //   true
  // );

  // await getUserRoleMappings();

  // await deleteUserRolesMappingById("97d1ead3-9db0-5fa0-9903-1ea801b8196b");

  // await createSpecialities();
  // await createRoles();

  // await createDoctorSpecialityMapping(
  //   "97d1ead3-9db0-5fa0-9903-1ea801b8196b",
  //   "08721aa2-0b17-5173-8fa2-746443d2aa5f",
  //   true,
  //   false,
  //   false
  // );

  // await createDoctorSpecialityMapping(
  //   "97d1ead3-9db0-5fa0-9903-1ea801b8196b",
  //   "108aa19f-40e9-561c-a88a-53ad20a6c99e",
  //   false,
  //   true,
  //   false
  // );

  // const doctorSpecialityMappings = await getDoctorSpecialityMappings(
  //   "97d1ead3-9db0-5fa0-9903-1ea801b8196b"
  // );

  // console.log(doctorSpecialityMappings);

  // await deleteDoctorSpecialityMappingsByDoctorId(
  //   "97d1ead3-9db0-5fa0-9903-1ea801b8196b"
  // );

  // const doctorSpecialityMappingToDelete =
  //   await deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId(
  //     "97d1ead3-9db0-5fa0-9903-1ea801b8196b",
  //     "08721aa2-0b17-5173-8fa2-746443d2aa5f"
  //   );

  // console.log("deleted mapping doc spec", doctorSpecialityMappingToDelete);

  // await createUsers(3, "doctor");
  // await createUsers(10, "patient");

  const fastifyServerIPAddress = getServerIPAddressEnv();
  const fastifyServerPort = getServerPortEnv();

  await fastifyServer.listen({
    port: fastifyServerPort,
    host: fastifyServerIPAddress,
  });
};

startServer();

// const numClusterWorkers = 3;
// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   for (let i = 0; i < numClusterWorkers; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) =>
//     console.log(`worker ${worker.process.pid} died`)
//   );

//   cluster.on("online", (worker) => {
//     // console.log("Yay, the worker responded after it was forked");
//   });
// } else {
//   try {
//     startServer();
//   } catch (error) {
//     console.log(error);
//   }
// }
