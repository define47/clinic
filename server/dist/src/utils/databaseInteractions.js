"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createAppointments = exports.createDoctors = exports.createPatients = exports.createUsers = exports.createAppointment = exports.createDoctorSpecialityMapping = exports.deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId = exports.deleteDoctorSpecialityMappingsByDoctorId = exports.deleteUserRolesMappingById = exports.getDoctorSpecialityMappings = exports.getUserRoleMappings = exports.createSpecialities = exports.createRoles = exports.createUser = void 0;
const argon2 = __importStar(require("argon2"));
const appointment_model_1 = require("../models/appointment.model");
const doctorMedicalSpecialityMapping_model_1 = require("../models/doctorMedicalSpecialityMapping.model");
const role_model_1 = require("../models/role.model");
const medicalSpeciality_model_1 = require("../models/medicalSpeciality.model");
const user_model_1 = require("../models/user.model");
const userRoleMapping_model_1 = require("../models/userRoleMapping.model");
const appointment_repository_1 = require("../repositories/appointment.repository");
const doctorMedicalSpecialityMapping_repository_1 = require("../repositories/doctorMedicalSpecialityMapping.repository");
const role_repository_1 = require("../repositories/role.repository");
const medicalSpeciality_repository_1 = require("../repositories/medicalSpeciality.repository");
const user_repository_1 = require("../repositories/user.repository");
const userRoleMapping_repository_1 = require("../repositories/userRoleMapping.repository");
const dotenv_1 = require("./dotenv");
const drizzle_1 = require("./drizzle");
const user_service_1 = require("../services/user.service");
const userRoleMapping_service_1 = require("../services/userRoleMapping.service");
const users_1 = require("./users");
const doctorMedicalSpecialityMapping_service_1 = require("../services/doctorMedicalSpecialityMapping.service");
const appointment_service_1 = require("../services/appointment.service");
const userRepository = new user_repository_1.UserRepository(drizzle_1.drizzleInstance, user_model_1.userTable);
const roleRepository = new role_repository_1.RoleRepository(drizzle_1.drizzleInstance, role_model_1.roleTable);
const userRoleMappingRepository = new userRoleMapping_repository_1.UserRoleMappingRepository(drizzle_1.drizzleInstance, userRoleMapping_model_1.userRoleMappingTable);
const specialityRepository = new medicalSpeciality_repository_1.MedicalSpecialityRepository(drizzle_1.drizzleInstance, medicalSpeciality_model_1.medicalSpecialityTable);
const doctorSpecialityMappingRepository = new doctorMedicalSpecialityMapping_repository_1.DoctorMedicalSpecialityMappingRepository(drizzle_1.drizzleInstance, doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable);
const appointmentRepository = new appointment_repository_1.AppointmentRepository(drizzle_1.drizzleInstance, appointment_model_1.appointmentTable);
const specialities = [
    "08721aa2-0b17-5173-8fa2-746443d2aa5f",
    "108aa19f-40e9-561c-a88a-53ad20a6c99e",
    "21041809-4d79-57ce-818a-712c959e936c",
    "b6fc4cff-c43e-5db6-ad00-043dc50b8563",
];
const createUser = (userForename, userSurname, userEmail, userPhoneNumber, userDateOfBirth, userGender, userAddress, userEncryptedPassword, isAdmin, isDoctor, isReceptionist, isPatient) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield userRepository.createUser({
        userForename,
        userSurname,
        userEmail,
        userPhoneNumber,
        userDateOfBirth,
        userGender,
        userAddress,
        userEncryptedPassword,
    });
    user = user;
    if (isAdmin)
        yield userRoleMappingRepository.createUserRoleMapping({
            userId: user.userId,
            roleId: (0, dotenv_1.getAdminRoleIdEnv)(),
        });
    if (isDoctor) {
        yield userRoleMappingRepository.createUserRoleMapping({
            userId: user.userId,
            roleId: (0, dotenv_1.getDoctorRoleIdEnv)(),
        });
        let numberOfSpecialities = Math.floor(Math.random() * 3) + 1;
        console.log(numberOfSpecialities);
        for (let i = 0; i < numberOfSpecialities; i++) {
            (0, exports.createDoctorSpecialityMapping)(user.userId, specialities[i], i === 0, i === 1, i === 2);
        }
    }
    if (isReceptionist)
        yield userRoleMappingRepository.createUserRoleMapping({
            userId: user.userId,
            roleId: (0, dotenv_1.getReceptionistRoleIdEnv)(),
        });
    if (isPatient)
        yield userRoleMappingRepository.createUserRoleMapping({
            userId: user.userId,
            roleId: (0, dotenv_1.getPatientRoleIdEnv)(),
        });
    // console.log(getDoctorRoleIdEnv());
});
exports.createUser = createUser;
const createRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    yield roleRepository.createRole({ roleName: "admin" });
    yield roleRepository.createRole({ roleName: "doctor" });
    yield roleRepository.createRole({ roleName: "patient" });
    yield roleRepository.createRole({ roleName: "receptionist" });
    yield roleRepository.createRole({ roleName: "nurse" });
});
exports.createRoles = createRoles;
const createSpecialities = () => __awaiter(void 0, void 0, void 0, function* () {
    yield specialityRepository.createMedicalSpeciality({
        medicalSpecialityName: "Neurology",
    });
    yield specialityRepository.createMedicalSpeciality({
        medicalSpecialityName: "Internal Medicine",
    });
    yield specialityRepository.createMedicalSpeciality({
        medicalSpecialityName: "Anesthesiology",
    });
    yield specialityRepository.createMedicalSpeciality({
        medicalSpecialityName: "Dermatology",
    });
});
exports.createSpecialities = createSpecialities;
const getUserRoleMappings = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield userRoleMappingRepository.getUserRoleMappingsByUserId("97d1ead3-9db0-5fa0-9903-1ea801b8196b"));
});
exports.getUserRoleMappings = getUserRoleMappings;
const getDoctorSpecialityMappings = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield doctorSpecialityMappingRepository.getDoctorMedicalSpecialityMappingsByDoctorId(doctorId);
});
exports.getDoctorSpecialityMappings = getDoctorSpecialityMappings;
const deleteUserRolesMappingById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield userRoleMappingRepository.deleteUserRoleMappingsByUserId(userId);
});
exports.deleteUserRolesMappingById = deleteUserRolesMappingById;
const deleteDoctorSpecialityMappingsByDoctorId = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    yield doctorSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingsByDoctorId(doctorId);
});
exports.deleteDoctorSpecialityMappingsByDoctorId = deleteDoctorSpecialityMappingsByDoctorId;
const deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId = (doctorId, specialityId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield doctorSpecialityMappingRepository.deleteDoctorMedicalSpecialityMappingByDoctorIdAndMedicalSpecialityId(doctorId, specialityId);
});
exports.deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId = deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId;
const createDoctorSpecialityMapping = (doctorId, medicalSpecialityId, isPrimaryMedicalSpeciality, isSecondaryMedicalSpeciality, isTertiaryMedicalSpeciality) => __awaiter(void 0, void 0, void 0, function* () {
    yield doctorSpecialityMappingRepository.createDoctorMedicalSpecialityMapping({
        doctorId,
        medicalSpecialityId,
        isPrimaryMedicalSpeciality,
        isSecondaryMedicalSpeciality,
        isTertiaryMedicalSpeciality,
    });
});
exports.createDoctorSpecialityMapping = createDoctorSpecialityMapping;
const createAppointment = (appointmentDoctorId, appointmentPatientId, appointmentReason, appointmentDateTime, appointmentStatus) => __awaiter(void 0, void 0, void 0, function* () {
    return yield appointmentRepository.createAppointment({
        appointmentDoctorId,
        appointmentPatientId,
        appointmentDateTime,
        appointmentReason,
        appointmentStatus,
    });
});
exports.createAppointment = createAppointment;
const createUsers = (start, end, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = start; i < end; i++) {
        (0, exports.createUser)(`${roleName}fn${i}`, `${roleName}ln${i}`, `${roleName}em${i}`, `${roleName}ph${i}`, "1234-01-01", "male", `${roleName}addr${i}`, `${roleName}pass${i}`, roleName === "admin", roleName === "doctor", roleName === "receptionist", roleName === "patient");
    }
});
exports.createUsers = createUsers;
const userService = new user_service_1.UserService();
const userRoleMappingService = new userRoleMapping_service_1.UserRoleMappingService();
const doctorMedicalSpecialityMappingService = new doctorMedicalSpecialityMapping_service_1.DoctorMedicalSpecialityMappingService();
const appointmentService = new appointment_service_1.AppointmentService();
const createPatients = () => __awaiter(void 0, void 0, void 0, function* () {
    const patientsData = (0, users_1.getPatientsData)();
    const patientRoleId = (0, dotenv_1.getPatientRoleIdEnv)();
    for (let i = 0; i < patientsData.length; i++) {
        let currentPatientData = patientsData[i];
        let patient = yield userService.createUser({
            userForename: currentPatientData.userForename,
            userSurname: currentPatientData.userSurname,
            userEmail: currentPatientData.userEmail,
            userPhoneNumber: currentPatientData.userPhoneNumber,
            userDateOfBirth: currentPatientData.userDateOfBirth,
            userGender: currentPatientData.userGender,
            userAddress: currentPatientData.userAddress,
            userEncryptedPassword: yield argon2.hash(currentPatientData.userEncryptedPassword),
        });
        yield userRoleMappingService.createUserRoleMapping({
            userId: patient === null || patient === void 0 ? void 0 : patient.userId,
            roleId: patientRoleId,
        });
    }
});
exports.createPatients = createPatients;
const createDoctors = () => __awaiter(void 0, void 0, void 0, function* () {
    const doctorRoleId = (0, dotenv_1.getDoctorRoleIdEnv)();
    const doctorsData = (0, users_1.getDoctorData)();
    for (let i = 0; i < doctorsData.length; i++) {
        let currentDoctorData = doctorsData[i];
        let doctor = yield userService.createUser({
            userForename: currentDoctorData.userForename,
            userSurname: currentDoctorData.userSurname,
            userEmail: currentDoctorData.userEmail,
            userPhoneNumber: currentDoctorData.userPhoneNumber,
            userDateOfBirth: currentDoctorData.userDateOfBirth,
            userGender: currentDoctorData.userGender,
            userAddress: currentDoctorData.userAddress,
            userEncryptedPassword: yield argon2.hash(currentDoctorData.userEncryptedPassword),
        });
        yield userRoleMappingService.createUserRoleMapping({
            userId: doctor === null || doctor === void 0 ? void 0 : doctor.userId,
            roleId: doctorRoleId,
        });
        let numberOfSpecialities = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numberOfSpecialities; i++) {
            yield doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping({
                doctorId: doctor === null || doctor === void 0 ? void 0 : doctor.userId,
                medicalSpecialityId: specialities[i],
                isPrimaryMedicalSpeciality: i === 0,
                isSecondaryMedicalSpeciality: i === 1,
                isTertiaryMedicalSpeciality: i === 2,
            });
        }
    }
});
exports.createDoctors = createDoctors;
const generateAppointmentDate = (year, month, day) => {
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
const createAppointments = (amount, year, month, day) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const patientRoleId = (0, dotenv_1.getPatientRoleIdEnv)();
    const doctorRoleId = (0, dotenv_1.getDoctorRoleIdEnv)();
    const patients = (_a = (yield userRoleMappingRepository.getAllUsersRelatedData(patientRoleId, [], "", 100, 0, "userForename"))) === null || _a === void 0 ? void 0 : _a.usersRelatedData;
    const doctors = (_b = (yield userRoleMappingRepository.getAllUsersRelatedData(doctorRoleId, [], "", 100, 0, "userForename"))) === null || _b === void 0 ? void 0 : _b.usersRelatedData;
    // console.log(patients);
    // console.log(doctors);
    // console.log(randomPatient);
    for (let i = 0; i < amount; i++) {
        let randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        let randomPatient = patients[Math.floor(Math.random() * patients.length)];
        yield appointmentService.createAppointment({
            appointmentDoctorId: randomDoctor.doctorId,
            appointmentPatientId: randomPatient.user.userId,
            appointmentDateTime: new Date(generateAppointmentDate(year, month, day)),
            appointmentReason: `Doctor: ${randomDoctor.doctorForename} ${randomDoctor.doctorSurname} Patient: ${randomPatient.user.userForename} ${randomPatient.user.userSurname} ${i}`,
            appointmentStatus: "scheduled",
        });
    }
});
exports.createAppointments = createAppointments;
