import fastifyEnv from "@fastify/env";
import Fastify from "fastify";
import fastifyRedis from "@fastify/redis";

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

fastifyServer.get("/", async (request, reply) => {
  return { hello: "world fastify" };
});

const start = async () => {
  try {
    fastifyServer.register(fastifyEnv, options);
    fastifyServer.register(fastifyRedis, {
      host: "127.0.0.1",
      // password: "your strong password here",
      port: 6379, // Redis port
      family: 4, // 4 (IPv4) or 6 (IPv6)
    });
    await fastifyServer;

    // console.log(fastifyServer.config);

    const baseRepositoryUsers = new BaseRepository(drizzleInstance, userTable);
    const baseRepositoryRoles = new BaseRepository(drizzleInstance, roleTable);
    const baseRepositorySpecialities = new BaseRepository(
      drizzleInstance,
      specialityTable
    );
    const baseRepositoryUserRolesMapping = new BaseRepository(
      drizzleInstance,
      userRolesMappingsTable
    );
    const baseRepositoryDoctorSpecialitiesMapping = new BaseRepository(
      drizzleInstance,
      doctorSpecialitiesMappingsTable
    );

    console.log(
      "herenow",
      await baseRepositoryUsers.getByAttribute(
        "userId",
        "48631bef-8a77-51ca-b719-dfe17b719081"
      )
    );

    console.log(
      "herenow",
      await baseRepositoryRoles.getByAttribute(
        "roleId",
        "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8"
      )
    );

    const { redis } = fastifyServer;
    await redis.set("key", "value");

    console.log(await redis.get("key"));

    // await baseRepositoryUserRolesMapping.create({ userId: "", roleId: "" });

    // const user = await baseRepositoryUsers.create({
    //   userForename: "test1fn",
    //   userSurname: "test1ln",
    //   userEmail: "test1em",
    //   userPhoneNumber: "test1ph",
    //   userGender: "male",
    //   userDateOfBirth: "1234-01-01",
    //   userAddress: "test1addr",
    //   userEncryptedPassword: "test1pass",
    // });
    // console.log(user);

    // const patientRole = await baseRepositoryRoles.create({
    //   roleName: "patient",
    // });
    // console.log(patientRole);

    // const neurologySpeciality = await baseRepositorySpecialities.create({
    //   specialityName: "Neurology",
    // });
    // console.log(neurologySpeciality);

    // const userRoleMapping = await baseRepositoryUserRolesMapping.create({
    //   userId: "48631bef-8a77-51ca-b719-dfe17b719081",
    //   roleId: "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8",
    // });
    // console.log(userRoleMapping);

    // const doctorSpecialityMapping =
    //   await baseRepositoryDoctorSpecialitiesMapping.create({
    //     doctorId: "48631bef-8a77-51ca-b719-dfe17b719081",
    //     specialityId: "108aa19f-40e9-561c-a88a-53ad20a6c99e",
    //     isPrimarySpeciality: true,
    //     isSecondarySpeciality: false,
    //     isTertiarySpeciality: false,
    //   });
    // console.log(doctorSpecialityMapping);

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
