import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { migrateToDb } from "./utils/drizzle.js";

// import { migrateToDb } from "./utils/drizzle";

declare module "fastify" {
  interface FastifyInstance {
    config: any;
  }
}

export const fastifyServer = Fastify({
  logger: true,
});

fastifyServer.get("/", async (request, reply) => {
  return { hello: "world fastify" };
});

const start = async () => {
  try {
    fastifyServer.register(fastifyEnv, options);
    await fastifyServer;
    // console.log(typeof process.env.SERVER_PORT);
    console.log(fastifyServer.config);
    console.log(getAdminRoleIdEnv());

    await migrateToDb();

    const fastifyServerIPAddress = getServerIPAddressEnv();
    const fastifyServerPort = getServerPortEnv();
    console.log(getDatabaseSchemaEnv());

    await fastifyServer.listen({
      port: fastifyServerPort,
      host: fastifyServerIPAddress,
    });
  } catch (error) {
    console.log(error);
  }
};

start();
