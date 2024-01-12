import z from "zod";

const userRoles = z.enum(["admin", "doctor", "receptionist", "patient"]);
const userSchemaZod = z.object({
  userId: z.string(),
  userForename: z.string({
    required_error: "Forename is required",
    invalid_type_error: "Forename must be a string",
  }),
  userSurname: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
  userGender: z.string(),
  userDateOfBirth: z.string(),
  userAddress: z.string(),
  userEncryptedPassword: z.string().min(5, "password too short"),
  roleName: userRoles,
});

const createUserSchemaZod = z.object({});

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

if (!result.success) console.log(result.error.errors[0].message);
if (result.success) console.log(result.data);
