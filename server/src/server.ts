import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import fastifyRedis from "@fastify/redis";
import cluster from "node:cluster";

import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { drizzleInstance, migrateToDb } from "./utils/drizzle.js";
import { BaseRepository } from "./repositories/base.repository.js";
import { User, userTable } from "./models/user.model.js";
import { roleTable } from "./models/role.model.js";
import { specialityTable } from "./models/speciality.model.js";
import { userRolesMappingsTable } from "./models/userRolesMappings.model.js";
import { doctorSpecialitiesMappingsTable } from "./models/doctorSpecialitiesMappings.js";

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
  const { redis } = fastifyServer;
  const userRepo = new BaseRepository(drizzleInstance, userTable);
  // await redis.set("mykey2024get", JSON.stringify(request));
  return {
    hello: "world fastify",
    redis: await redis.get("mykey2024get"),
    testUser: await userRepo.getById("48631bef-8a77-51ca-b719-dfe17b719081"),
  };
});

fastifyServer.get("/blocking", async (request, reply) => {
  const { redis } = fastifyServer;
  // await redis.set("mykey2024get", JSON.stringify(request));
  let counter = 0;
  for (let i = 0; i < 6_000_000_000; i++) {
    counter = counter + 1;
  }

  return { counter };
});

const numClusterWorkers = 2;
const start = async () => {
  // try {
  //   fastifyServer.register(fastifyEnv, options);
  //   fastifyServer.register(fastifyRedis, {
  //     host: "127.0.0.1",
  //     // password: "your strong password here",
  //     port: 6379,
  //     family: 4,
  //   });
  //   await fastifyServer;

  //   await migrateToDb();

  //   const fastifyServerIPAddress = getServerIPAddressEnv();
  //   const fastifyServerPort = getServerPortEnv();

  //   await fastifyServer.listen({
  //     port: fastifyServerPort,
  //     host: fastifyServerIPAddress,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  if (cluster.isPrimary) {
    for (let i = 0; i < numClusterWorkers; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) =>
      console.log(`worker ${worker.process.pid} died`)
    );

    cluster.on("online", (worker) => {
      console.log("Yay, the worker responded after it was forked");
    });
  } else {
    try {
      fastifyServer.register(fastifyEnv, options);
      fastifyServer.register(fastifyRedis, {
        host: "127.0.0.1",
        // password: "your strong password here",
        port: 6379,
        family: 4,
      });
      await fastifyServer;

      await migrateToDb();

      const fastifyServerIPAddress = getServerIPAddressEnv();
      const fastifyServerPort = getServerPortEnv();

      await fastifyServer.listen({
        port: fastifyServerPort,
        host: fastifyServerIPAddress,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

start();
