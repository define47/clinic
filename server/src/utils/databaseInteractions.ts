import { roleTable } from "../models/role.model";
import { User, userTable } from "../models/user.model";
import { userRoleMappingTable } from "../models/userRoleMapping.model";
import { RoleRepository } from "../repositories/role.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserRoleMappingRepository } from "../repositories/userRoleMapping.repository";
import { drizzleInstance } from "./drizzle";

const userRepository = new UserRepository(drizzleInstance, userTable);
const roleRepository = new RoleRepository(drizzleInstance, roleTable);
const userRoleMappingRepository = new UserRoleMappingRepository(
  drizzleInstance,
  userRoleMappingTable
);

export const createUser = async (
  userForename: string,
  userSurname: string,
  userEmail: string,
  userPhoneNumber: string,
  userDateOfBirth: string,
  userGender: string,
  userAddress: string,
  userEncryptedPassword: string,
  roleId: string
) => {
  let user = await userRepository.createUser({
    userForename,
    userSurname,
    userEmail,
    userPhoneNumber,
    userDateOfBirth,
    userGender,
    userAddress,
    userEncryptedPassword,
  });

  user = user as User;

  await userRoleMappingRepository.createUserRoleMapping({
    userId: user.userId,
    roleId,
  });
};

export const createRoles = async () => {
  await roleRepository.createRole({ roleName: "admin" });
  await roleRepository.createRole({ roleName: "doctor" });
  await roleRepository.createRole({ roleName: "patient" });
  await roleRepository.createRole({ roleName: "receptionist" });
  await roleRepository.createRole({ roleName: "nurse" });
};
