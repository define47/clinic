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
exports.BaseRepository = void 0;
const user_model_1 = require("../models/user.model");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const dotenv_1 = require("../utils/dotenv");
const role_model_1 = require("../models/role.model");
const medicalSpeciality_model_1 = require("../models/medicalSpeciality.model");
const userRoleMapping_model_1 = require("../models/userRoleMapping.model");
const doctorMedicalSpecialityMapping_model_1 = require("../models/doctorMedicalSpecialityMapping.model");
const appointment_model_1 = require("../models/appointment.model");
const appointmentHistory_model_1 = require("../models/appointmentHistory.model");
const medicalRecordPatient_model_1 = require("../models/medicalRecordPatient.model");
const language_model_1 = require("../models/language.model");
const userPreferencesMapping_model_1 = require("../models/userPreferencesMapping.model");
const medicalProcedure_model_1 = require("../models/medicalProcedure.model");
const medicalSpecialityMedicalProcedureMapping_model_1 = require("../models/medicalSpecialityMedicalProcedureMapping.model");
class BaseRepository {
    constructor(drizzle, table) {
        this._drizzle = drizzle;
        this._table = table;
        if (this._table === user_model_1.userTable)
            this._tableColumns = [
                "userId",
                "userForename",
                "userSurname",
                "userEmail",
                "userPhoneNumber",
                "userGender",
                "userDateOfBirth",
                "userAddress",
                "userEncryptedPassword",
                "isUserEmailActivated",
                "isUserApprovedByAdmin",
                "isUserBanned",
                "userCreatedAt",
                "userUpdatedAt",
            ];
        else if (table === role_model_1.roleTable)
            this._tableColumns = [
                "roleId",
                "roleName",
                "roleCreatedAt",
                "roleUpdatedAt",
            ];
        else if (table === medicalSpeciality_model_1.medicalSpecialityTable)
            this._tableColumns = [
                "medicalSpecialityId",
                "medicalSpecialityName",
                "medicalSpecialityCreatedAt",
                "medicalSpecialityUpdatedAt",
            ];
        else if (table === userRoleMapping_model_1.userRoleMappingTable)
            this._tableColumns = [
                "userId",
                "roleId",
                "userRoleMappingCreatedAt",
                "userRoleMappingUpdatedAt",
            ];
        else if (table === doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
            this._tableColumns = [
                "doctorId",
                "medicalSpecialityId",
                "isPrimaryMedicalSpeciality",
                "isSecondaryMedicalSpeciality",
                "isTertiaryMedicalSpeciality",
                "doctorMedicalSpecialityMappingCreatedAt",
                "doctorMedicalSpecialityMappingUpdatedAt",
            ];
        else if (table === appointment_model_1.appointmentTable)
            this._tableColumns = [
                "appointmentId",
                "appointmentDoctorId",
                "appointmentPatientId",
                "appointmentDateTime",
                "appointmentReason",
                "appointmentStatus",
                "appointmentCancellationReason",
                "appointmentCreatedAt",
                "appointmentUpdatedAt",
            ];
        else if (table === appointmentHistory_model_1.appointmentHistoryTable)
            this._tableColumns = [
                "appointmentHistoryId",
                "appointmentId",
                "appointmentHistoryDoctorId",
                "appointmentHistoryPatientId",
                "appointmentHistoryDateTime",
                "appointmentHistoryReason",
                "appointmentHistoryStatus",
                "appointmentHistoryCancellationReason",
                "appointmentHistoryCreatedBy",
                "appointmentHistoryUpdatedBy",
                "appointmentHistoryCreatedAt",
                "appointmentHistoryUpdatedAt",
            ];
        else if (table === medicalRecordPatient_model_1.medicalRecordPatientTable)
            this._tableColumns = [
                "medicalRecordPatientId",
                "appointmentId",
                "symptoms",
                "conductedTests",
                "diagnosis",
                "recommendations",
                "medicalRecordPatientCreatedAt",
                "medicalRecordPatientUpdatedAt",
            ];
        else if (table === language_model_1.languageTable)
            this._tableColumns = ["languageId", "languageName", "languageCode"];
        else if (table === userPreferencesMapping_model_1.userPreferencesMappingTable)
            this._tableColumns = ["userId", "languageId", "isDarkModeOn"];
        else if (table === medicalProcedure_model_1.medicalProcedureTable)
            this._tableColumns = [
                "medicalProcedureId",
                "medicalProcedureName",
                "medicalProcedurePrice",
                "medicalProcedureCreatedAt",
                "medicalProcedureUpdatedAt",
            ];
        else if (table === medicalSpecialityMedicalProcedureMapping_model_1.medicalSpecialityMedicalProcedureMappingTable)
            this._tableColumns = [
                "medicalSpecialityId",
                "medicalProcedureId",
                "medicalSpecialityMedicalProcedureMappingCreatedAt",
                "medicalSpecialityMedicalProcedureMappingUpdatedAt",
            ];
        else
            this._tableColumns = [];
        // type MyKeys = keyof typeof this._table.$inferSelect;
        // type MyObject = Record<MyKeys, any>;
        // const dummyVariable: MyObject = {
        //   userId: "",
        //   userForename: "test1fn",
        //   userSurname: "test1ln",
        //   userEmail: "test1em",
        //   userPhoneNumber: "test1ph",
        //   userGender: "male",
        //   userDateOfBirth: "1234-01-01",
        //   userAddress: "test1addr",
        //   userEncryptedPassword: "test1pass",
        //   createdAt: "",
        //   updatedAt: "",
        // };
        // console.log("here", Object.keys(dummyVariable));
    }
    getNecessaryAttributesForUUIDv5() {
        if (this._table === user_model_1.userTable) {
            return ["userEmail"];
        }
        else if (this._table === role_model_1.roleTable) {
            return ["roleName"];
        }
        else if (this._table === medicalSpeciality_model_1.medicalSpecialityTable) {
            return ["medicalSpecialityName"];
        }
        else if (this._table === userRoleMapping_model_1.userRoleMappingTable) {
            return ["userId", "roleId"];
        }
        else if (this._table === doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable) {
            return ["doctorId", "medicalSpecialityId"];
        }
        else if (this._table === appointment_model_1.appointmentTable) {
            return [
                "appointmentDoctorId",
                "appointmentPatientId",
                "appointmentDateTime",
            ];
        }
        else if (this._table === appointmentHistory_model_1.appointmentHistoryTable) {
            return [
                "appointmentId",
                "appointmentHistoryCreatedAt",
                "appointmentHistoryUpdatedAt",
            ];
        }
        else if (this._table === medicalRecordPatient_model_1.medicalRecordPatientTable)
            return ["appointmentId"];
        else if (this._table === language_model_1.languageTable)
            return ["languageName"];
        else if (this._table === medicalProcedure_model_1.medicalProcedureTable)
            return ["medicalName"];
        else {
            return "";
        }
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._drizzle
                .select()
                .from(this._table)
                .where((0, drizzle_orm_1.eq)(this._table[this._tableColumns[0]], id)))[0];
        });
    }
    getByAttribute(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._drizzle
                .select()
                .from(this._table)
                .where((0, drizzle_orm_1.eq)(this._table[key], value)))[0];
        });
    }
    create(creationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id;
                const UUIDv5Attributes = this.getNecessaryAttributesForUUIDv5();
                if (UUIDv5Attributes.length === 1)
                    id = (0, uuid_1.v5)(creationAttributes[UUIDv5Attributes[0]], (0, dotenv_1.getUUIDv5NamespaceEnv)());
                else if (UUIDv5Attributes.length === 2)
                    id = (0, uuid_1.v5)(`${creationAttributes[UUIDv5Attributes[0]]} ${creationAttributes[UUIDv5Attributes[1]]}`, (0, dotenv_1.getUUIDv5NamespaceEnv)());
                else if (UUIDv5Attributes.length === 3)
                    id = (0, uuid_1.v5)(`${creationAttributes[UUIDv5Attributes[0]]} ${creationAttributes[UUIDv5Attributes[1]]} ${creationAttributes[UUIDv5Attributes[2]]}`, (0, dotenv_1.getUUIDv5NamespaceEnv)());
                const entityAttributes = {};
                entityAttributes[this._tableColumns[0]] =
                    this._table[this._tableColumns[0]];
                for (const key in creationAttributes) {
                    entityAttributes[key] = this._table[key];
                }
                // console.log(returningObject);
                if (this._table === userRoleMapping_model_1.userRoleMappingTable ||
                    this._table === doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                    return (yield this._drizzle
                        .insert(this._table)
                        .values(Object.assign({}, creationAttributes))
                        .returning(entityAttributes))[0];
                return (yield this._drizzle
                    .insert(this._table)
                    .values(Object.assign({ [this._tableColumns[0]]: id }, creationAttributes))
                    .returning(entityAttributes))[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    update(id, updateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entityAttributes = {};
                // entityAttributes[this._tableColumns[0]] =
                //   this._table[this._tableColumns[0] as keyof T];
                // for (const key in updateAttributes) {
                //   entityAttributes[key] = this._table[key as keyof T];
                // }
                // const dummyObject: Appointment = {
                //   appointmentId: "",
                //   appointmentDoctorId: "",
                //   appointmentPatientId: "",
                //   appointmentReason: "",
                //   appointmentDateTime: new Date(),
                //   appointmentStatus: "",
                //   appointmentCancellationReason: "",
                // };
                for (const key in this._tableColumns) {
                    // console.log(key);
                    entityAttributes[this._tableColumns[key]] =
                        this._table[this._tableColumns[key]];
                }
                // console.log(entityAttributes[0]);
                return (yield this._drizzle
                    .update(this._table)
                    .set(updateAttributes)
                    .where((0, drizzle_orm_1.eq)(this._table[this._tableColumns[0]], id))
                    .returning(entityAttributes))[0];
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    delete(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._table === appointmentHistory_model_1.appointmentHistoryTable ||
                    this._table === medicalRecordPatient_model_1.medicalRecordPatientTable)
                    return (yield this._drizzle
                        .delete(this._table)
                        .where((0, drizzle_orm_1.eq)(this._table[this._tableColumns[1]], id))
                        .returning({ id: this._table[this._tableColumns[1]] }))[0].id;
                return (_a = (yield this._drizzle
                    .delete(this._table)
                    .where((0, drizzle_orm_1.eq)(this._table[this._tableColumns[0]], id))
                    .returning({ id: this._table[this._tableColumns[0]] }))[0]) === null || _a === void 0 ? void 0 : _a.id;
                // if (idt) return idt;
                // return undefined;
                // return id;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
