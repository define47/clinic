import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import {
  getAdminRoleIdEnv,
  getDatabaseSchemaEnv,
  getServerIPAddressEnv,
  getServerPortEnv,
  options,
} from "./utils/dotenv.js";
import { drizzleInstance, migrateToDb } from "./utils/drizzle.js";
import { BaseRepository } from "./repositories/base.repository.js";
import { userTable } from "./models/user.model.js";

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

fastifyServer.get("/", async (request, reply) => {
  return { hello: "world fastify" };
});

const start = async () => {
  try {
    fastifyServer.register(fastifyEnv, options);
    await fastifyServer;

    // console.log(fastifyServer.config);

    const baseRepository = new BaseRepository(drizzleInstance, userTable);
    await baseRepository.create({
      userForename: "test1fn",
      userSurname: "test1ln",
      userEmail: "test1em",
      userPhoneNumber: "test1ph",
      userGender: "male",
      userDateOfBirth: "1234-01-01",
      userAddress: "test1addr",
      userEncryptedPassword: "test1pass",
    });

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
};

start();
