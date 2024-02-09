import * as argon2 from "argon2";
import { RoleService } from "../services/role.service";
import { UserService } from "../services/user.service";
import { UserCreationAttributes } from "../models/user.model";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { MedicalProcedureService } from "../services/medicalProcedure.service";
import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";
import { LanguageService } from "../services/language.service";
import { AppointmentService } from "../services/appointment.service";

const userService = new UserService();
const userRoleMappingService = new UserRoleMappingService();
const roleService = new RoleService();
const medicalSpecialityService = new MedicalSpecialityService();
const medicalProcedureService = new MedicalProcedureService();
const doctorMedicalSpecialityMappingService =
  new DoctorMedicalSpecialityMappingService();
const languageService = new LanguageService();
const appointmentService = new AppointmentService();
export async function createUser(
  userForename: string,
  userSurname: string,
  userEmail: string,
  userPhoneNumber: string,
  userGender: string,
  userDateOfBirth: string,
  userAddress: string,
  userEncryptedPassword: string,
  isUserEmailActivated: boolean,
  isUserApprovedByAdmin: boolean,
  isUserSuspended: boolean,
  isUserBanned: boolean
) {
  const userToCreate = await userService.createUser({
    userForename,
    userSurname,
    userEmail,
    userPhoneNumber,
    userGender,
    userDateOfBirth,
    userAddress,
    userEncryptedPassword,
    isUserEmailActivated,
    isUserApprovedByAdmin,
    isUserSuspended,
    isUserBanned,
  });
  console.log("User Created:", userToCreate);

  return userToCreate;
}

export async function updateUser(
  userId: string,
  userForename: string,
  userSurname: string,
  userEmail: string,
  userPhoneNumber: string,
  userGender: string,
  userDateOfBirth: string,
  userAddress: string,
  userEncryptedPassword?: string,
  isUserEmailActivated?: boolean,
  isUserApprovedByAdmin?: boolean,
  isUserSuspended?: boolean,
  isUserBanned?: boolean
) {
  const userToUpdate = await userService.updateUser(userId, {
    userForename,
    userSurname,
    userEmail,
    userPhoneNumber,
    userGender,
    userDateOfBirth,
    userAddress,
    userEncryptedPassword,
    isUserEmailActivated,
    isUserApprovedByAdmin,
    isUserSuspended,
    isUserBanned,
  });

  console.log("User Updated:", userToUpdate);

  return userToUpdate;
}

export async function deleteUser(userId: string) {
  const userToDelete = await userService.deleteUser(userId);
  console.log("User Deleted:", userToDelete);
  return userToDelete;
}

export async function createUserRoleMapping(userId: string, roleId: string) {
  const userRoleMappingToCreate =
    await userRoleMappingService.createUserRoleMapping({
      userId,
      roleId,
    });

  console.log("User Role Mapping Created:", userRoleMappingToCreate);

  return userRoleMappingToCreate;
}

export async function deleteUserRoleMapping(userId: string, roleId: string) {
  const userRoleMappingToDelete =
    await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
      userId,
      roleId
    );

  console.log("User Role Mapping Deleted:", userRoleMappingToDelete);

  return userRoleMappingToDelete;
}

export async function performAdminInteractions() {
  const adminRole = await roleService.getRoleByName("admin");

  const userToCreate = await createUser(
    "adminFN0",
    "adminLN0",
    "adminEM0",
    "adminPH0",
    "male",
    "1678-10-15",
    "adminADDR0",
    "adminPASS0",
    false,
    false,
    false,
    false
  );

  const userAdminRoleMappingToCreate = createUserRoleMapping(
    userToCreate?.userId!,
    adminRole?.roleId!
  );

  const userToUpdate = await updateUser(
    userToCreate?.userId!,
    "adminFN0 Updated",
    "adminLN0",
    "adminEM0",
    "adminPH0",
    "male",
    "1678-10-15",
    "adminADDR0"
  );

  const userAdminRoleMappingToDelete = deleteUserRoleMapping(
    userToCreate?.userId!,
    adminRole?.roleId!
  );

  const userToDelete = await deleteUser(userToCreate?.userId!);
}

export async function createDoctorSpecialityMapping(
  userId: string,
  medicalSpecialityId: string,
  isPrimaryMedicalSpeciality: boolean,
  isSecondaryMedicalSpeciality: boolean,
  isTertiaryMedicalSpeciality: boolean
) {
  const doctorMedicalSpecialityMappingToCreate =
    await doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping(
      {
        userId,
        medicalSpecialityId,
        isPrimaryMedicalSpeciality,
        isSecondaryMedicalSpeciality,
        isTertiaryMedicalSpeciality,
      }
    );

  console.log(
    "Created Doctor Medical Speciality Mapping",
    doctorMedicalSpecialityMappingToCreate
  );

  return doctorMedicalSpecialityMappingToCreate;
}

export async function deleteDoctorSpecialityMapping(
  doctorMedicalSpecialityMappingId: string
) {
  const doctorMedicalSpecialityMappingToDelete =
    await doctorMedicalSpecialityMappingService.deleteDoctorMedicalSpecialityMappingByMappingId(
      doctorMedicalSpecialityMappingId
    );

  console.log(
    "Doctor Medical Speciality Mapping Deleted:",
    doctorMedicalSpecialityMappingToDelete
  );
  return doctorMedicalSpecialityMappingToDelete;
}

export async function updateDoctorSpecialityMapping(
  doctorMedicalSpecialityMappingId: string,
  medicalSpecialityId: string,
  isPrimaryMedicalSpeciality: boolean,
  isSecondaryMedicalSpeciality: boolean,
  isTertiaryMedicalSpeciality: boolean
) {
  const doctorMedicalSpecialityMappingToUpdate =
    await doctorMedicalSpecialityMappingService.updateDoctorMedicalSpecialityMapping(
      doctorMedicalSpecialityMappingId,
      {
        medicalSpecialityId,
        isPrimaryMedicalSpeciality,
        isSecondaryMedicalSpeciality,
        isTertiaryMedicalSpeciality,
      }
    );

  console.log(
    "Doctor Medical Speciality Mapping Updated:",
    doctorMedicalSpecialityMappingToUpdate
  );
  return doctorMedicalSpecialityMappingToUpdate;
}

export async function performDoctorInteractions(shouldDelete: boolean) {
  const doctorRole = await roleService.getRoleByName("doctor");

  const userToCreate = await createUser(
    "doctorFN0",
    "doctorLN0",
    "doctorEM0",
    "doctorPH0",
    "male",
    "1678-10-15",
    "doctorADDR0",
    "doctorPASS0",
    false,
    false,
    false,
    false
  );

  const userDoctorRoleMappingToCreate = createUserRoleMapping(
    userToCreate?.userId!,
    doctorRole?.roleId!
  );

  const userToUpdate = await updateUser(
    userToCreate?.userId!,
    "doctorFN0 Updated",
    "doctorLN0",
    "doctorEM0",
    "doctorPH0",
    "male",
    "1678-10-15",
    "doctorADDR0"
  );

  const doctorNeurologyMappingToCreate = await createDoctorSpecialityMapping(
    userToCreate?.userId!,
    "108aa19f-40e9-561c-a88a-53ad20a6c99e",
    true,
    false,
    false
  );

  const doctorNeurologyMappingToUpdateToInternalMedicine =
    updateDoctorSpecialityMapping(
      doctorNeurologyMappingToCreate?.doctorMedicalSpecialityMappingId!,
      "08721aa2-0b17-5173-8fa2-746443d2aa5f",
      true,
      false,
      false
    );

  const doctorNeurologyMappingToDelete = deleteDoctorSpecialityMapping(
    doctorNeurologyMappingToCreate?.doctorMedicalSpecialityMappingId!
  );

  if (shouldDelete) {
    const userDoctorRoleMappingToDelete = deleteUserRoleMapping(
      userToCreate?.userId!,
      doctorRole?.roleId!
    );

    const userToDelete = await deleteUser(userToCreate?.userId!);
  }
}

export async function createPatients(start: number, end: number) {
  const patientRole = await roleService.getRoleByName("patient");
  for (let i = start; i < end; i++) {
    let user = await createUser(
      "patientFN",
      "patientLN" + i,
      "patientEM" + i,
      "patientPH" + i,
      "male",
      "1678-10-15",
      "patientADDR" + i,
      "patientPASS" + i,
      false,
      false,
      false,
      false
    );

    await createUserRoleMapping(user?.userId!, patientRole?.roleId!);
  }
}

export async function createRoles() {
  const adminRole = await roleService.createRole({ roleName: "admin" });
  const doctorRole = await roleService.createRole({ roleName: "doctor" });
  const patientRole = await roleService.createRole({ roleName: "patient" });
  const receptionistRole = await roleService.createRole({
    roleName: "receptionist",
  });
  const nurseRole = await roleService.createRole({ roleName: "nurse" });
}

export const createSpecialities = async () => {
  await medicalSpecialityService.createMedicalSpeciality({
    medicalSpecialityName: "Neurology",
  });
  await medicalSpecialityService.createMedicalSpeciality({
    medicalSpecialityName: "Internal Medicine",
  });
  await medicalSpecialityService.createMedicalSpeciality({
    medicalSpecialityName: "Anesthesiology",
  });
  await medicalSpecialityService.createMedicalSpeciality({
    medicalSpecialityName: "Dermatology",
  });
};

export const createLanguages = async () => {
  await languageService.createLanguage({
    languageName: "Romanian",
    languageCode: "ro",
  });
  await languageService.createLanguage({
    languageName: "British English",
    languageCode: "en-GB",
  });
  await languageService.createLanguage({
    languageName: "American English",
    languageCode: "en-US",
  });
};

function getRandomDate(
  year: number,
  month: number,
  day: number,
  minHour: number,
  maxHour: number
) {
  const daysInMonth = new Date(year, month, 0).getDate();
  // const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

  const randomHour =
    Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
  const minutes = [0, 15, 30, 45];
  // const randomMinute = Math.floor(Math.random() * 60);
  const randomMinute = minutes[Math.floor(Math.random() * minutes.length)];

  const randomDate = new Date(year, month - 1, day, randomHour, randomMinute);

  return randomDate;
}

export const createAppointments = async (start: number, end: number) => {
  const patientRole = await roleService.getRoleByName("patient");
  const doctorRole = await roleService.getRoleByName("doctor");
  const patients = (await userRoleMappingService.getAllUsersRelatedData(
    patientRole?.roleId!,
    ["userForename"],
    "",
    9999999,
    0,
    "asc:userForename"
  ))!.tableData;
  const doctors = (await userRoleMappingService.getAllUsersRelatedData(
    doctorRole?.roleId!,
    ["userForename"],
    "",
    9999999,
    0,
    "asc:userForename"
  ))!.tableData;

  // console.log(doctors);
  const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
  const randomPatient = doctors[Math.floor(Math.random() * doctors.length)];

  for (let start = 0; start < end; start++) {
    let randomAppointmentDateTime = getRandomDate(2024, 2, 9, 8, 18);
    await appointmentService.createAppointment({
      appointmentDoctorId: randomDoctor.userId,
      appointmentPatientId: randomPatient.userId,
      appointmentDateTime: randomAppointmentDateTime,
      appointmentReason: `${randomDoctor.userForename} ${randomDoctor.userSurname} - ${randomPatient.userForename} ${randomPatient.userSurname}`,
      appointmentStatus: "scheduled",
    });
  }
};
