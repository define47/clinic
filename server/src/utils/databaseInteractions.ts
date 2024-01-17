import { appointmentTable } from "../models/appointment.model";
import { doctorMedicalSpecialityMappingTable } from "../models/doctorMedicalSpecialityMapping.model";
import { roleTable } from "../models/role.model";
import { medicalSpecialityTable } from "../models/medicalSpeciality.model";
import { User, userTable } from "../models/user.model";
import { userRoleMappingTable } from "../models/userRoleMapping.model";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { DoctorMedicalSpecialityMappingRepository } from "../repositories/doctorMedicalSpecialityMapping.repository";
import { RoleRepository } from "../repositories/role.repository";
import { MedicalSpecialityRepository } from "../repositories/medicalSpeciality.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserRoleMappingRepository } from "../repositories/userRoleMapping.repository";
import {
  getAdminRoleIdEnv,
  getDoctorRoleIdEnv,
  getPatientRoleIdEnv,
  getReceptionistRoleIdEnv,
} from "./dotenv";
import { drizzleInstance } from "./drizzle";

const userRepository = new UserRepository(drizzleInstance, userTable);
const roleRepository = new RoleRepository(drizzleInstance, roleTable);
const userRoleMappingRepository = new UserRoleMappingRepository(
  drizzleInstance,
  userRoleMappingTable
);
const specialityRepository = new MedicalSpecialityRepository(
  drizzleInstance,
  medicalSpecialityTable
);
const doctorSpecialityMappingRepository =
  new DoctorMedicalSpecialityMappingRepository(
    drizzleInstance,
    doctorMedicalSpecialityMappingTable
  );
const appointmentRepository = new AppointmentRepository(
  drizzleInstance,
  appointmentTable
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
  isAdmin: boolean,
  isDoctor: boolean,
  isReceptionist: boolean,
  isPatient: boolean
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

  if (isAdmin)
    await userRoleMappingRepository.createUserRoleMapping({
      userId: user.userId,
      roleId: getAdminRoleIdEnv(),
    });

  if (isDoctor)
    await userRoleMappingRepository.createUserRoleMapping({
      userId: user.userId,
      roleId: getDoctorRoleIdEnv(),
    });

  if (isReceptionist)
    await userRoleMappingRepository.createUserRoleMapping({
      userId: user.userId,
      roleId: getReceptionistRoleIdEnv(),
    });

  if (isPatient)
    await userRoleMappingRepository.createUserRoleMapping({
      userId: user.userId,
      roleId: getPatientRoleIdEnv(),
    });

  // console.log(getDoctorRoleIdEnv());
};

export const createRoles = async () => {
  await roleRepository.createRole({ roleName: "admin" });
  await roleRepository.createRole({ roleName: "doctor" });
  await roleRepository.createRole({ roleName: "patient" });
  await roleRepository.createRole({ roleName: "receptionist" });
  await roleRepository.createRole({ roleName: "nurse" });
};

export const createSpecialities = async () => {
  await specialityRepository.createMedicalSpeciality({
    specialityName: "Neurology",
  });
  await specialityRepository.createMedicalSpeciality({
    specialityName: "Internal Medicine",
  });
  await specialityRepository.createMedicalSpeciality({
    specialityName: "Anesthesiology",
  });
  await specialityRepository.createMedicalSpeciality({
    specialityName: "Dermatology",
  });
};

export const getUserRoleMappings = async () => {
  console.log(
    await userRoleMappingRepository.getUserRoleMappingsByUserId(
      "97d1ead3-9db0-5fa0-9903-1ea801b8196b"
    )
  );
};

export const getDoctorSpecialityMappings = async (doctorId: string) => {
  return await doctorSpecialityMappingRepository.getDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId
  );
};

export const deleteUserRolesMappingById = async (userId: string) => {
  await userRoleMappingRepository.deleteUserRoleMappingsByUserId(userId);
};

export const deleteDoctorSpecialityMappingsByDoctorId = async (
  doctorId: string
) => {
  await doctorSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingsByDoctorId(
    doctorId
  );
};

export const deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId = async (
  doctorId: string,
  specialityId: string
) => {
  return await doctorSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(
    doctorId,
    specialityId
  );
};

export const createDoctorSpecialityMapping = async (
  doctorId: string,
  specialityId: string,
  isPrimarySpeciality: boolean,
  isSecondarySpeciality: boolean,
  isTertiarySpeciality: boolean
) => {
  await doctorSpecialityMappingRepository.createDoctorMedicalSpecialityMapping({
    doctorId,
    specialityId,
    isPrimarySpeciality,
    isSecondarySpeciality,
    isTertiarySpeciality,
  });
};

export const createAppointment = async (
  appointmentDoctorId: string,
  appointmentPatientId: string,
  appointmentReason: string,
  appointmentDateTime: string,
  appointmentStatus: string
) => {
  return await appointmentRepository.createAppointment({
    appointmentDoctorId,
    appointmentPatientId,
    appointmentDateTime,
    appointmentReason,
    appointmentStatus,
  });
};

export const createUsers = async (amount: number, roleName: string) => {
  for (let i = 0; i < amount; i++) {
    createUser(
      `${roleName}fn${i}`,
      `${roleName}ln${i}`,
      `${roleName}em${i}`,
      `${roleName}ph${i}`,
      "1234-01-01",
      "male",
      `${roleName}addr${i}`,
      `${roleName}pass${i}`,
      roleName === "admin",
      roleName === "doctor",
      roleName === "receptionist",
      roleName === "patient"
    );
  }
};
