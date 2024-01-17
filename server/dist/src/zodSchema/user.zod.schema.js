"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const userRoles = zod_1.default.enum(["admin", "doctor", "receptionist", "patient"]);
const userSchemaZod = zod_1.default.object({
    userId: zod_1.default.string(),
    userForename: zod_1.default.string({
        required_error: "Forename is required",
        invalid_type_error: "Forename must be a string",
    }),
    userSurname: zod_1.default.string(),
    userEmail: zod_1.default.string(),
    userPhoneNumber: zod_1.default.string(),
    userGender: zod_1.default.string(),
    userDateOfBirth: zod_1.default.string(),
    userAddress: zod_1.default.string(),
    userEncryptedPassword: zod_1.default.string().min(5, "password too short"),
    roleName: userRoles,
});
const createUserSchemaZod = zod_1.default.object({});
const payload = {
    userForename: "userForename1",
    userSurname: "userSurname1",
    userEmail: "userEmail1",
    userPhoneNumber: "userPhoneNumber1",
    userGender: "userGender1",
    userDateOfBirth: "userDateOfBirth1",
    userAddress: "userAddress1",
    userEncryptedPassword: "userPass1",
    roleName: "patient",
};
const result = userSchemaZod.safeParse(payload);
if (!result.success)
    console.log(result.error.errors[0].message);
if (result.success)
    console.log(result.data);
