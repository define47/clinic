"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientRoleIdEnv = exports.getReceptionistRoleIdEnv = exports.getDoctorRoleIdEnv = exports.getAdminRoleIdEnv = exports.getDatabaseHostEnv = exports.getDatabasePort = exports.getDatabaseUsernameEnv = exports.getDatabasePasswordEnv = exports.getDatabaseNameEnv = exports.getDatabaseSchemaEnv = exports.getReactClientPortEnv = exports.getReactClientIPAddressEnv = exports.getServerPortEnv = exports.getServerIPAddressEnv = exports.getUUIDv5NamespaceEnv = exports.options = exports.schema = void 0;
const server_js_1 = require("../server.js");
exports.schema = {
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
    },
};
exports.options = {
    confKey: "config",
    schema: exports.schema,
    dotenv: true,
    data: process.env,
};
const getUUIDv5NamespaceEnv = () => {
    return server_js_1.fastifyServer.config.UUID_V5_NAMESPACE;
};
exports.getUUIDv5NamespaceEnv = getUUIDv5NamespaceEnv;
const getServerIPAddressEnv = () => {
    return server_js_1.fastifyServer.config.SERVER_IP_ADDRESS;
};
exports.getServerIPAddressEnv = getServerIPAddressEnv;
const getServerPortEnv = () => {
    return server_js_1.fastifyServer.config.SERVER_PORT;
};
exports.getServerPortEnv = getServerPortEnv;
const getReactClientIPAddressEnv = () => {
    return server_js_1.fastifyServer.config.REACT_CLIENT_IP_ADDRESS;
};
exports.getReactClientIPAddressEnv = getReactClientIPAddressEnv;
const getReactClientPortEnv = () => {
    return server_js_1.fastifyServer.config.REACT_CLIENT_PORT;
};
exports.getReactClientPortEnv = getReactClientPortEnv;
const getDatabaseSchemaEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    return server_js_1.fastifyServer.config.DATABASE_SCHEMA;
});
exports.getDatabaseSchemaEnv = getDatabaseSchemaEnv;
const getDatabaseNameEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    return server_js_1.fastifyServer.config.DATABASE_NAME;
});
exports.getDatabaseNameEnv = getDatabaseNameEnv;
const getDatabasePasswordEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    return server_js_1.fastifyServer.config.DATABASE_PASSWORD;
});
exports.getDatabasePasswordEnv = getDatabasePasswordEnv;
const getDatabaseUsernameEnv = () => __awaiter(void 0, void 0, void 0, function* () {
    return server_js_1.fastifyServer.config.DATABASE_USERNAME;
});
exports.getDatabaseUsernameEnv = getDatabaseUsernameEnv;
const getDatabasePort = () => {
    return server_js_1.fastifyServer.config.DATABASE_PORT;
};
exports.getDatabasePort = getDatabasePort;
const getDatabaseHostEnv = () => {
    return server_js_1.fastifyServer.config.DATABASE_HOST;
};
exports.getDatabaseHostEnv = getDatabaseHostEnv;
const getAdminRoleIdEnv = () => {
    return server_js_1.fastifyServer.config.ADMIN_ROLE_ID;
};
exports.getAdminRoleIdEnv = getAdminRoleIdEnv;
const getDoctorRoleIdEnv = () => {
    return server_js_1.fastifyServer.config.DOCTOR_ROLE_ID;
};
exports.getDoctorRoleIdEnv = getDoctorRoleIdEnv;
const getReceptionistRoleIdEnv = () => {
    return server_js_1.fastifyServer.config.RECEPTIONIST_ROLE_ID;
};
exports.getReceptionistRoleIdEnv = getReceptionistRoleIdEnv;
const getPatientRoleIdEnv = () => {
    return server_js_1.fastifyServer.config.PATIENT_ROLE_ID;
};
exports.getPatientRoleIdEnv = getPatientRoleIdEnv;
