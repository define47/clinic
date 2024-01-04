import { fastifyServer } from "../server";

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
    "REACT_CLIENT_PORT",
    "REACT_CLIENT_IP_ADDRESS",
    "ADMIN_ROLE_ID",
    "DOCTOR_ROLE_ID",
    "RECEPTIONIST_ROLE_ID",
    "PATIENT_ROLE_ID",
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
  },
};

export const options = {
  confKey: "config",
  schema,
  dotenv: true,
  data: process.env,
};

export const getReactClientIPAddressEnv = () => {
  return fastifyServer.config.REACT_CLIENT_IP_ADDRESS;
};

export const getReactClientPortEnv = () => {
  return fastifyServer.config.REACT_CLIENT_PORT;
};

export const getDatabaseNameEnv = () => {
  return fastifyServer.config.DATABASE_NAME;
};

export const getDatabasePasswordEnv = () => {
  return fastifyServer.config.DATABASE_PASSWORD;
};

export const getDatabaseUsernameEnv = () => {
  return fastifyServer.config.DATABASE_USERNAME;
};

export const getDatabasePort = () => {
  return fastifyServer.config.DATABASE_PORT;
};

export const getDatabaseHostEnv = () => {
  return fastifyServer.config.DATABASE_HOST;
};

export const getAdminRoleIdEnv = () => {
  return fastifyServer.config.ADMIN_ROLE_ID;
};

export const getDoctorRoleIdEnv = () => {
  return fastifyServer.config.DOCTOR_ROLE_ID;
};

export const getReceptionistRoleIdEnv = () => {
  return fastifyServer.config.RECEPTIONIST_ROLE_ID;
};

export const getPatientRoleIdEnv = () => {
  return fastifyServer.config.PATIENT_ROLE_ID;
};
