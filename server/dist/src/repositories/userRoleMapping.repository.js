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
exports.UserRoleMappingRepository = void 0;
const userRoleMapping_model_1 = require("../models/userRoleMapping.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
const role_model_1 = require("../models/role.model");
const user_model_1 = require("../models/user.model");
const dotenv_1 = require("../utils/dotenv");
const doctorMedicalSpecialityMapping_model_1 = require("../models/doctorMedicalSpecialityMapping.model");
const medicalSpeciality_model_1 = require("../models/medicalSpeciality.model");
class UserRoleMappingRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getUserRoleMappingByUserIdAndRoleId(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._drizzle
                .select()
                .from(userRoleMapping_model_1.userRoleMappingTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, userId), (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, roleId)));
        });
    }
    /*
     * getting all roles for a certain user
     */
    getUserRoleMappingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._drizzle
                .select()
                .from(userRoleMapping_model_1.userRoleMappingTable)
                .where((0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, userId));
        });
    }
    getAllUsersRelatedData(roleId, searchBy, searchQuery, limit, page, orderBy) {
        return __awaiter(this, void 0, void 0, function* () {
            let columnToSearchBy1;
            let columnToSearchBy2;
            columnToSearchBy1 = user_model_1.userTable.userForename;
            columnToSearchBy2 = user_model_1.userTable.userForename;
            if (searchBy.length === 1) {
                if (searchBy[0] === "userForename")
                    columnToSearchBy1 = user_model_1.userTable.userForename;
                else if (searchBy[0] === "userSurname")
                    columnToSearchBy1 = user_model_1.userTable.userSurname;
                else if (searchBy[0] === "userEmail")
                    columnToSearchBy1 = user_model_1.userTable.userEmail;
                else if (searchBy[0] === "userPhoneNumber")
                    columnToSearchBy1 = user_model_1.userTable.userPhoneNumber;
                else if (searchBy[0] === "userGender")
                    columnToSearchBy1 = user_model_1.userTable.userGender;
                else if (searchBy[0] === "userDateOfBirth")
                    columnToSearchBy1 = user_model_1.userTable.userDateOfBirth;
                else if (searchBy[0] === "userAddress")
                    columnToSearchBy1 = user_model_1.userTable.userAddress;
                else if (searchBy[0] === "medicalSpecialityName")
                    columnToSearchBy1 = medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName;
            }
            else if (searchBy.length === 2) {
                if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
                    columnToSearchBy1 = user_model_1.userTable.userForename;
                    columnToSearchBy2 = user_model_1.userTable.userSurname;
                }
                else if (searchBy[0] === "userSurname" &&
                    searchBy[1] === "userForename") {
                    columnToSearchBy1 = user_model_1.userTable.userSurname;
                    columnToSearchBy2 = user_model_1.userTable.userForename;
                }
            }
            const columnToOrderByData = orderBy.split(":");
            let columnToOrderBy;
            if (columnToOrderByData[0] === "asc" &&
                columnToOrderByData[1] !== "medicalSpecialityName") {
                columnToOrderBy = (0, drizzle_orm_1.asc)(user_model_1.userTable[columnToOrderByData[1]]);
            }
            else if (columnToOrderByData[0] === "desc" &&
                columnToOrderByData[1] !== "medicalSpecialityName") {
                columnToOrderBy = (0, drizzle_orm_1.desc)(user_model_1.userTable[columnToOrderByData[1]]);
            }
            else if (columnToOrderByData[0] === "asc" &&
                columnToOrderByData[1] === "medicalSpecialityName") {
                columnToOrderBy = (0, drizzle_orm_1.asc)(medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName);
            }
            else if (columnToOrderByData[0] === "desc" &&
                columnToOrderByData[1] === "medicalSpecialityName") {
                columnToOrderBy = (0, drizzle_orm_1.desc)(medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName);
            }
            const condition = {
                userSearchQuery: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, roleId), searchBy.length === 1
                    ? (0, drizzle_orm_1.ilike)(columnToSearchBy1, `${searchQuery}%`)
                    : searchBy.length === 2
                        ? (0, drizzle_orm_1.sql) `CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
                        : (0, drizzle_orm_1.sql) `TRUE`),
                doctorSearchQuery: searchBy.length === 1
                    ? (0, drizzle_orm_1.ilike)(columnToSearchBy1, `%${searchQuery}%`)
                    : searchBy.length === 2
                        ? (0, drizzle_orm_1.sql) `CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
                        : (0, drizzle_orm_1.sql) `TRUE`,
            };
            let totalCount;
            let data;
            let offset = page * limit;
            if (roleId === (0, dotenv_1.getPatientRoleIdEnv)() ||
                roleId === (0, dotenv_1.getAdminRoleIdEnv)() ||
                roleId === (0, dotenv_1.getReceptionistRoleIdEnv)()) {
                totalCount = yield this._drizzle
                    .select({ totalCount: (0, drizzle_orm_1.count)() })
                    .from(this._table)
                    .innerJoin(role_model_1.roleTable, (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, role_model_1.roleTable.roleId))
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, user_model_1.userTable.userId))
                    .where(condition.userSearchQuery);
                data = yield this._drizzle
                    .select({
                    user: {
                        userId: user_model_1.userTable.userId,
                        userForename: user_model_1.userTable.userForename,
                        userSurname: user_model_1.userTable.userSurname,
                        userEmail: user_model_1.userTable.userEmail,
                        userPhoneNumber: user_model_1.userTable.userPhoneNumber,
                        userGender: user_model_1.userTable.userGender,
                        userDateOfBirth: user_model_1.userTable.userDateOfBirth,
                        userAddress: user_model_1.userTable.userAddress,
                    },
                    role: {
                        roleId: userRoleMapping_model_1.userRoleMappingTable.roleId,
                        roleName: role_model_1.roleTable.roleName,
                    },
                })
                    .from(this._table)
                    .innerJoin(role_model_1.roleTable, (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, role_model_1.roleTable.roleId))
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, user_model_1.userTable.userId))
                    .where(condition.userSearchQuery)
                    .limit(limit)
                    .offset(offset)
                    .orderBy(columnToOrderBy);
                return {
                    usersRelatedData: data,
                    totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
                    totalCount: totalCount[0].totalCount,
                };
            }
            else if (roleId === (0, dotenv_1.getDoctorRoleIdEnv)()) {
                totalCount = yield this._drizzle
                    .select({
                    totalCount: (0, drizzle_orm_1.count)(),
                })
                    .from(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.doctorId, user_model_1.userTable.userId))
                    .innerJoin(medicalSpeciality_model_1.medicalSpecialityTable, (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.medicalSpecialityId, medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId))
                    .where(condition.doctorSearchQuery);
                data = yield this._drizzle
                    .select({
                    doctor: {
                        doctorId: user_model_1.userTable.userId,
                        doctorForename: user_model_1.userTable.userForename,
                        doctorSurname: user_model_1.userTable.userSurname,
                        doctorEmail: user_model_1.userTable.userEmail,
                        doctorPhoneNumber: user_model_1.userTable.userPhoneNumber,
                        doctorGender: user_model_1.userTable.userGender,
                        doctorDateOfBirth: user_model_1.userTable.userDateOfBirth,
                        doctorAddress: user_model_1.userTable.userAddress,
                    },
                    medicalSpeciality: {
                        medicalSpecialityId: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId,
                        medicalSpecialityName: medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityName,
                        isPrimaryMedicalSpeciality: doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.isPrimaryMedicalSpeciality,
                        isSecondaryMedicalSpeciality: doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.isSecondaryMedicalSpeciality,
                        isTertiaryMedicalSpeciality: doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.isTertiaryMedicalSpeciality,
                    },
                })
                    .from(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable)
                    .innerJoin(user_model_1.userTable, (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.doctorId, user_model_1.userTable.userId))
                    .innerJoin(medicalSpeciality_model_1.medicalSpecialityTable, (0, drizzle_orm_1.eq)(doctorMedicalSpecialityMapping_model_1.doctorMedicalSpecialityMappingTable.medicalSpecialityId, medicalSpeciality_model_1.medicalSpecialityTable.medicalSpecialityId))
                    .where(condition.doctorSearchQuery)
                    // .orderBy(
                    //   asc(
                    //     orderBy === "medicalSpecialityName"
                    //       ? medicalSpecialityTable[orderBy as keyof MedicalSpeciality]
                    //       : userTable[orderBy as keyof User]
                    //   )
                    // );
                    .orderBy(columnToOrderBy);
                const resultArray = Array.from(data
                    .reduce((doctorMap, { doctor, medicalSpeciality }) => {
                    const { doctorId, doctorForename, doctorSurname, doctorEmail, doctorPhoneNumber, doctorGender, doctorDateOfBirth, doctorAddress, } = doctor;
                    const { medicalSpecialityName, isPrimaryMedicalSpeciality, isSecondaryMedicalSpeciality, isTertiaryMedicalSpeciality, } = medicalSpeciality;
                    if (!doctorMap.has(doctorId)) {
                        doctorMap.set(doctorId, {
                            doctorId,
                            doctorForename,
                            doctorSurname,
                            doctorEmail,
                            doctorPhoneNumber,
                            doctorGender,
                            doctorDateOfBirth,
                            doctorAddress,
                            medicalSpecialities: [],
                        });
                    }
                    const doctorEntry = doctorMap.get(doctorId);
                    let designation = "";
                    if (isPrimaryMedicalSpeciality) {
                        designation = " (P)";
                    }
                    else if (isSecondaryMedicalSpeciality) {
                        designation = " (S)";
                    }
                    else if (isTertiaryMedicalSpeciality) {
                        designation = " (T)";
                    }
                    doctorEntry.medicalSpecialities.push(`${medicalSpecialityName}${designation}`);
                    return doctorMap;
                }, new Map())
                    .values());
                return {
                    usersRelatedData: resultArray,
                    totalCount: totalCount[0].totalCount,
                    totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
                };
            }
            return undefined;
        });
    }
    createUserRoleMapping(userRoleMappingCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(userRoleMappingCreationAttributes);
        });
    }
    /*
     * updating a role for a certain user
     */
    updateUserRoleMapping(userId, currentRoleId, newRoleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._drizzle
                .update(userRoleMapping_model_1.userRoleMappingTable)
                .set({ roleId: newRoleId })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, userId), (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, currentRoleId)))
                .returning({
                userId: userRoleMapping_model_1.userRoleMappingTable.userId,
                roleId: userRoleMapping_model_1.userRoleMappingTable.roleId,
            }))[0];
        });
    }
    deleteUserRoleMappingByUserIdAndRoleId(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._drizzle
                .delete(userRoleMapping_model_1.userRoleMappingTable)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.userId, userId), (0, drizzle_orm_1.eq)(userRoleMapping_model_1.userRoleMappingTable.roleId, roleId)))
                .returning({
                userId: userRoleMapping_model_1.userRoleMappingTable.userId,
                roleId: userRoleMapping_model_1.userRoleMappingTable.roleId,
            }))[0];
        });
    }
    deleteUserRoleMappingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delete(userId);
        });
    }
}
exports.UserRoleMappingRepository = UserRoleMappingRepository;
