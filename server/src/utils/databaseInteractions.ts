import * as argon2 from "argon2";

import { appointmentTable } from "../models/appointment.model";
import {
  DoctorMedicalSpecialityMappingJoinUserAndSpeciality,
  doctorMedicalSpecialityMappingTable,
} from "../models/doctorMedicalSpecialityMapping.model";
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
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { getDoctorData, getPatientsData } from "./users";
import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";
import { AppointmentService } from "../services/appointment.service";

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

const specialities = [
  "08721aa2-0b17-5173-8fa2-746443d2aa5f",
  "108aa19f-40e9-561c-a88a-53ad20a6c99e",
  "21041809-4d79-57ce-818a-712c959e936c",
  "b6fc4cff-c43e-5db6-ad00-043dc50b8563",
];
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

  if (isDoctor) {
    await userRoleMappingRepository.createUserRoleMapping({
      userId: user.userId,
      roleId: getDoctorRoleIdEnv(),
    });

    let numberOfSpecialities = Math.floor(Math.random() * 3) + 1;
    console.log(numberOfSpecialities);

    for (let i = 0; i < numberOfSpecialities; i++) {
      createDoctorSpecialityMapping(
        user.userId,
        specialities[i],
        i === 0,
        i === 1,
        i === 2
      );
    }
  }

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
    medicalSpecialityName: "Neurology",
  });
  await specialityRepository.createMedicalSpeciality({
    medicalSpecialityName: "Internal Medicine",
  });
  await specialityRepository.createMedicalSpeciality({
    medicalSpecialityName: "Anesthesiology",
  });
  await specialityRepository.createMedicalSpeciality({
    medicalSpecialityName: "Dermatology",
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
  medicalSpecialityId: string,
  isPrimaryMedicalSpeciality: boolean,
  isSecondaryMedicalSpeciality: boolean,
  isTertiaryMedicalSpeciality: boolean
) => {
  await doctorSpecialityMappingRepository.createDoctorMedicalSpecialityMapping({
    doctorId,
    medicalSpecialityId,
    isPrimaryMedicalSpeciality,
    isSecondaryMedicalSpeciality,
    isTertiaryMedicalSpeciality,
  });
};

export const createAppointment = async (
  appointmentDoctorId: string,
  appointmentPatientId: string,
  appointmentReason: string,
  appointmentDateTime: Date,
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

export const createUsers = async (
  start: number,
  end: number,
  roleName: string
) => {
  for (let i = start; i < end; i++) {
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

const userService = new UserService();
const userRoleMappingService = new UserRoleMappingService();
const doctorMedicalSpecialityMappingService =
  new DoctorMedicalSpecialityMappingService();
const appointmentService = new AppointmentService();

export const createPatients = async () => {
  const patientsData = getPatientsData();
  const patientRoleId = getPatientRoleIdEnv();

  for (let i = 0; i < patientsData.length; i++) {
    let currentPatientData = patientsData[i];
    let patient = await userService.createUser({
      userForename: currentPatientData.userForename,
      userSurname: currentPatientData.userSurname,
      userEmail: currentPatientData.userEmail,
      userPhoneNumber: currentPatientData.userPhoneNumber,
      userDateOfBirth: currentPatientData.userDateOfBirth,
      userGender: currentPatientData.userGender,
      userAddress: currentPatientData.userAddress,
      userEncryptedPassword: await argon2.hash(
        currentPatientData.userEncryptedPassword
      ),
    });

    await userRoleMappingService.createUserRoleMapping({
      userId: patient?.userId!,
      roleId: patientRoleId,
    });
  }
};

export const createDoctors = async () => {
  const doctorRoleId = getDoctorRoleIdEnv();
  const doctorsData = getDoctorData();

  for (let i = 0; i < doctorsData.length; i++) {
    let currentDoctorData = doctorsData[i];
    let doctor = await userService.createUser({
      userForename: currentDoctorData.userForename,
      userSurname: currentDoctorData.userSurname,
      userEmail: currentDoctorData.userEmail,
      userPhoneNumber: currentDoctorData.userPhoneNumber,
      userDateOfBirth: currentDoctorData.userDateOfBirth,
      userGender: currentDoctorData.userGender,
      userAddress: currentDoctorData.userAddress,
      userEncryptedPassword: await argon2.hash(
        currentDoctorData.userEncryptedPassword
      ),
    });

    await userRoleMappingService.createUserRoleMapping({
      userId: doctor?.userId!,
      roleId: doctorRoleId,
    });

    let numberOfSpecialities = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfSpecialities; i++) {
      await doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping(
        {
          doctorId: doctor?.userId!,
          medicalSpecialityId: specialities[i],
          isPrimaryMedicalSpeciality: i === 0,
          isSecondaryMedicalSpeciality: i === 1,
          isTertiaryMedicalSpeciality: i === 2,
        }
      );
    }
  }
};

const generateAppointmentDate = (year: string, month: string, day: string) => {
  const times = [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
  ];

  var time = times[Math.floor(Math.random() * times.length)];

  return `${year}-${month}-${day}T${time}:00.000Z`;
};

export const createAppointments = async (
  amount: number,
  year: string,
  month: string,
  day: string
) => {
  const patientRoleId = getPatientRoleIdEnv();
  const doctorRoleId = getDoctorRoleIdEnv();

  const patients = (
    await userRoleMappingRepository.getAllUsersRelatedData(
      patientRoleId,
      [],
      "",
      100,
      0,
      "userForename"
    )
  )?.usersRelatedData as any;

  const doctors = (
    await userRoleMappingRepository.getAllUsersRelatedData(
      doctorRoleId,
      [],
      "",
      100,
      0,
      "userForename"
    )
  )?.usersRelatedData as any;
  // console.log(patients);
  // console.log(doctors);

  // console.log(randomPatient);

  for (let i = 0; i < amount; i++) {
    let randomDoctor = doctors![Math.floor(Math.random() * doctors!.length)];
    let randomPatient = patients![Math.floor(Math.random() * patients!.length)];
    await appointmentService.createAppointment({
      appointmentDoctorId: randomDoctor.doctorId,
      appointmentPatientId: randomPatient.user.userId,
      appointmentDateTime: new Date(generateAppointmentDate(year, month, day)),
      appointmentReason: `Doctor: ${randomDoctor.doctorForename} ${randomDoctor.doctorSurname} Patient: ${randomPatient.user.userForename} ${randomPatient.user.userSurname} ${i}`,
      appointmentStatus: "scheduled",
    });
  }
};
