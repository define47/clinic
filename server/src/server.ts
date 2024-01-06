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
import { User, userTable } from "./models/user.model.js";
import { roleTable } from "./models/role.model.js";
import { specialityTable } from "./models/speciality.model.js";

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

    const baseRepositoryUsers = new BaseRepository(drizzleInstance, userTable);
    const baseRepositoryRoles = new BaseRepository(drizzleInstance, roleTable);
    const baseRepositorySpecialities = new BaseRepository(
      drizzleInstance,
      specialityTable
    );

    const user = await baseRepositoryUsers.create({
      userForename: "test1fn",
      userSurname: "test1ln",
      userEmail: "test1em",
      userPhoneNumber: "test1ph",
      userGender: "male",
      userDateOfBirth: "1234-01-01",
      userAddress: "test1addr",
      userEncryptedPassword: "test1pass",
    });
    console.log(user);

    const patientRole = await baseRepositoryRoles.create({
      roleName: "patient",
    });
    console.log(patientRole);

    const neurologySpeciality = await baseRepositorySpecialities.create({
      specialityName: "Neurology",
    });
    console.log(neurologySpeciality);

    // console.log(
    //   await baseRepositoryUsers.getById("48631bef-8a77-51ca-b719-dfe17b719081")
    // );
    // console.log(
    //   await baseRepositoryRoles.getById("0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8")
    // );
    // console.log(
    //   await baseRepositorySpecialities.getById(
    //     "108aa19f-40e9-561c-a88a-53ad20a6c99e"
    //   )
    // );

    // await baseRepositoryUsers.delete("48631bef-8a77-51ca-b719-dfe17b719081");
    // await baseRepositoryRoles.delete("0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8");
    // await baseRepositorySpecialities.delete(
    //   "108aa19f-40e9-561c-a88a-53ad20a6c99e"
    // );

    // const userToUpdate = await baseRepositoryUsers.update(
    //   "48631bef-8a77-51ca-b719-dfe17b719081",
    //   {
    //     userForename: "test1fnup",
    //     userSurname: "test1lnupdated",
    //     userEmail: "test1emupup",
    //     userPhoneNumber: "test1phy",
    //     userGender: "male",
    //     userDateOfBirth: "1234-01-01",
    //     userAddress: "test1addrupup",
    //     userEncryptedPassword: "test1passqqqq",
    //   }
    // );
    // console.log(userToUpdate);

    // const roleToUpdate = await baseRepositoryRoles.update(
    //   "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8",
    //   { roleName: "patient updated" }
    // );
    // console.log(roleToUpdate);

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
