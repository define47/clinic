import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import { getAdminRoleIdEnv, options } from "./utils/dotenv";

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

    await fastifyServer.listen({ port: 3001 });
  } catch (error) {
    console.log(error);
  }
};

start();
