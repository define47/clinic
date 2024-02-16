import { fastifyServer } from "../server.js";

export const schema = {
  type: "object",
  required: [
    "SERVER_PORT",
    "SERVER_IP_ADDRESS",
    "UUID_V5_NAMESPACE",
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "DATABASE_SCHEMA",
    "REACT_CLIENT_PORT",
    "REACT_CLIENT_IP_ADDRESS",
    "ADMIN_ROLE_ID",
    "DOCTOR_ROLE_ID",
    "RECEPTIONIST_ROLE_ID",
    "PATIENT_ROLE_ID",
    "NURSE_ROLE_ID",
  ],
  properties: {
    SERVER_PORT: {
      type: "number",
    },
    SERVER_IP_ADDRESS: {
      type: "string",
    },
    UUID_V5_NAMESPACE: {
      type: "string",
    },
    DATABASE_HOST: {
      type: "string",
    },
    DATABASE_PORT: {
      type: "string",
    },
    DATABASE_USERNAME: {
      type: "string",
    },
    DATABASE_PASSWORD: {
      type: "string",
    },
    DATABASE_NAME: {
      type: "string",
    },
    DATABASE_SCHEMA: {
      type: "string",
    },
    REACT_CLIENT_PORT: {
      type: "string",
    },
    REACT_CLIENT_IP_ADDRESS: {
      type: "string",
    },
    ADMIN_ROLE_ID: {
      type: "string",
    },
    DOCTOR_ROLE_ID: {
      type: "string",
    },
    RECEPTIONIST_ROLE_ID: {
      type: "string",
    },
    PATIENT_ROLE_ID: {
      type: "string",
    },
    NURSE_ROLE_ID: {
      type: "string",
    },
  },
};

export const options = {
  confKey: "config",
  schema,
  dotenv: true,
  data: process.env,
};

export const getUUIDv5NamespaceEnv = (): string => {
  return fastifyServer.config.UUID_V5_NAMESPACE;
};

export const getServerIPAddressEnv = (): string => {
  return fastifyServer.config.SERVER_IP_ADDRESS;
};

export const getServerPortEnv = (): number => {
  return fastifyServer.config.SERVER_PORT;
};

export const getReactClientIPAddressEnv = (): string => {
  return fastifyServer.config.REACT_CLIENT_IP_ADDRESS;
};

export const getReactClientPortEnv = (): number => {
  return fastifyServer.config.REACT_CLIENT_PORT;
};

export const getDatabaseSchemaEnv = async (): Promise<string> => {
  return fastifyServer.config.DATABASE_SCHEMA;
};

export const getDatabaseNameEnv = async (): Promise<string> => {
  return fastifyServer.config.DATABASE_NAME;
};

export const getDatabasePasswordEnv = async (): Promise<string> => {
  return fastifyServer.config.DATABASE_PASSWORD;
};

export const getDatabaseUsernameEnv = async (): Promise<string> => {
  return fastifyServer.config.DATABASE_USERNAME;
};

export const getDatabasePort = (): number => {
  return fastifyServer.config.DATABASE_PORT;
};

export const getDatabaseHostEnv = (): string => {
  return fastifyServer.config.DATABASE_HOST;
};

export const getAdminRoleIdEnv = (): string => {
  return fastifyServer.config.ADMIN_ROLE_ID;
};

export const getDoctorRoleIdEnv = (): string => {
  return fastifyServer.config.DOCTOR_ROLE_ID;
};

export const getReceptionistRoleIdEnv = (): string => {
  return fastifyServer.config.RECEPTIONIST_ROLE_ID;
};

export const getPatientRoleIdEnv = (): string => {
  return fastifyServer.config.PATIENT_ROLE_ID;
};

export const getNurseRoleIdEnv = (): string => {
  return fastifyServer.config.NURSE_ROLE_ID;
};
