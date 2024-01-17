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
exports.createUsers = exports.createAppointment = exports.createDoctorSpecialityMapping = exports.deleteDoctorSpecialityMappingByDoctorIdAndSpecialityId = exports.deleteDoctorSpecialityMappingsByDoctorId = exports.deleteUserRolesMappingById = exports.getDoctorSpecialityMappings = exports.getUserRoleMappings = exports.createSpecialities = exports.createRoles = exports.createUser = void 0;
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
const userRepository = new user_repository_1.UserRepository(drizzle_1.drizzleInstance, user_model_1.userTable);
const roleRepository = new role_repository_1.RoleRepository(drizzle_1.drizzleInstance, role_model_1.roleTable);
const userRoleMappingRepository = new userRoleMapping_repository_1.UserRoleMappingRepository(drizzle_1.drizzleInstance, userRoleMapping_model_1.userRoleMappingTable);
const specialityRepository = new medicalSpeciality_repository_1.MedicalSpecialityRepository(drizzle_1.drizzleInstance, medicalSpeciality_model_1.medicalSpecialityTable);
const doctorSpecialityMappingRepository = new doctorMedicalSpecialityMapping_repository_1.DoctorMedicalSpecialityMappingRepository(drizzle_1.drizzleInstance, doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable);
const appointmentRepository = new appointment_repository_1.AppointmentRepository(drizzle_1.drizzleInstance, appointment_model_1.appointmentTable);
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
    if (isDoctor)
        yield userRoleMappingRepository.createUserRoleMapping({
            userId: user.userId,
            roleId: (0, dotenv_1.getDoctorRoleIdEnv)(),
        });
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
const createUsers = (amount, roleName) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < amount; i++) {
        (0, exports.createUser)(`${roleName}fn${i}`, `${roleName}ln${i}`, `${roleName}em${i}`, `${roleName}ph${i}`, "1234-01-01", "male", `${roleName}addr${i}`, `${roleName}pass${i}`, roleName === "admin", roleName === "doctor", roleName === "receptionist", roleName === "patient");
    }
});
exports.createUsers = createUsers;
