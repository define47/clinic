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
exports.AppointmentRepository = void 0;
const appointment_model_1 = require("../models/appointment.model");
const base_repository_1 = require("./base.repository");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("../models/user.model");
const pg_core_1 = require("drizzle-orm/pg-core");
class AppointmentRepository extends base_repository_1.BaseRepository {
    constructor(drizzle, table) {
        super(drizzle, table);
    }
    getFirstDayOfWeek(d) {
        // 👇️ clone date object, so we don't mutate it
        const date = new Date(d);
        const day = date.getDay(); // 👉️ get day of week
        // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }
    getAllAppointments(table, searchBy, searchQuery, scheduleFilter, orderBy, limit, page, doctorId, patientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filterBasedOnTable;
                const doctor = (0, pg_core_1.alias)(user_model_1.userTable, "doctor");
                const patient = (0, pg_core_1.alias)(user_model_1.userTable, "patient");
                const currentDate = new Date();
                let startDate, endDate;
                switch (table) {
                    case "doctor":
                        filterBasedOnTable = doctor;
                        break;
                    case "patient":
                        filterBasedOnTable = patient;
                    default:
                        break;
                }
                switch (scheduleFilter) {
                    case "today":
                        const currentDayStartInUTC = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0));
                        const currentDayEndInUTC = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999));
                        console.log("current day start:", currentDayStartInUTC);
                        console.log("current day end:", currentDayEndInUTC);
                        startDate = currentDayStartInUTC;
                        endDate = currentDayEndInUTC;
                        break;
                    case "week":
                        const firstDayOfCurrentWeek = this.getFirstDayOfWeek(new Date());
                        firstDayOfCurrentWeek.setUTCHours(0, 0, 0, 0);
                        const lastDayOfCurrentWeek = new Date(firstDayOfCurrentWeek);
                        lastDayOfCurrentWeek.setUTCHours(23, 59, 59, 999);
                        lastDayOfCurrentWeek.setDate(lastDayOfCurrentWeek.getDate() + 6);
                        console.log("first day of current week:", firstDayOfCurrentWeek);
                        console.log("last day of current week:", lastDayOfCurrentWeek);
                        startDate = firstDayOfCurrentWeek;
                        endDate = lastDayOfCurrentWeek;
                    case "month":
                        const currentMonthStart = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1, 0, 0, 0, 0));
                        const currentMonthEnd = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
                        console.log("current month start:", currentMonthStart);
                        console.log("current month end:", currentMonthEnd);
                        startDate = currentMonthStart;
                        endDate = currentMonthEnd;
                    case "nextWeek":
                        let startOfNextWeek = new Date(currentDate);
                        let daysUntilNextMonday = 8 - currentDate.getUTCDay();
                        startOfNextWeek.setUTCDate(currentDate.getUTCDate() + daysUntilNextMonday);
                        startOfNextWeek.setUTCHours(0, 0, 0, 0);
                        let endOfNextWeek = new Date(startOfNextWeek);
                        endOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 6);
                        endOfNextWeek.setUTCHours(23, 59, 59, 999);
                        console.log("Start of next week (UTC):", startOfNextWeek);
                        console.log("End of next week (UTC):", endOfNextWeek);
                        startDate = startOfNextWeek;
                        endDate = endOfNextWeek;
                    default:
                        break;
                }
                let columnToSearchBy1;
                let columnToSearchBy2;
                let columnToOrderBy1;
                let sortDirectionColumnToOrderBy1;
                columnToSearchBy1 = user_model_1.userTable.userForename;
                columnToSearchBy2 = user_model_1.userTable.userForename;
                columnToOrderBy1 = user_model_1.userTable.userForename;
                if (searchBy.length === 1 && table === "doctor") {
                    if (searchBy[0] === "userForename")
                        columnToSearchBy1 = doctor.userForename;
                    else if (searchBy[0] === "userSurname")
                        columnToSearchBy1 = doctor.userSurname;
                }
                else if (searchBy.length === 2 && table === "doctor") {
                    if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
                        columnToSearchBy1 = doctor.userForename;
                        columnToSearchBy2 = doctor.userSurname;
                    }
                    else if (searchBy[0] === "userSurname" &&
                        searchBy[1] === "userForename") {
                        columnToSearchBy1 = doctor.userSurname;
                        columnToSearchBy2 = doctor.userForename;
                    }
                }
                if (searchBy.length === 1 && table === "patient") {
                    if (searchBy[0] === "userForename")
                        columnToSearchBy1 = patient.userForename;
                    else if (searchBy[0] === "userSurname")
                        columnToSearchBy1 = patient.userSurname;
                }
                else if (searchBy.length === 2 && table === "patient") {
                    if (searchBy[0] === "userForename" && searchBy[1] === "userSurname") {
                        columnToSearchBy1 = patient.userForename;
                        columnToSearchBy2 = patient.userSurname;
                    }
                    else if (searchBy[0] === "userSurname" &&
                        searchBy[1] === "userForename") {
                        columnToSearchBy1 = patient.userSurname;
                        columnToSearchBy2 = patient.userForename;
                    }
                }
                let orderByFinal0;
                let orderByFinal1;
                const orderByColumns = [];
                if (orderBy.length === 1 && table === "doctor") {
                    const element0 = orderBy[0].split(":");
                    console.log(element0);
                    if (element0[0] === "asc") {
                        orderByFinal0 = (0, drizzle_orm_1.asc)(doctor[element0[1]]);
                        console.log(orderByFinal0);
                        orderByColumns.push(orderByFinal0);
                    }
                    else {
                        orderByFinal0 = (0, drizzle_orm_1.desc)(doctor[element0[1]]);
                        orderByColumns.push(orderByFinal0);
                    }
                }
                else if (orderBy.length === 2 && table === "doctor") {
                    const element0 = orderBy[0].split(":");
                    const element1 = orderBy[1].split(":");
                    if (element0[0] === "asc") {
                        orderByFinal0 = (0, drizzle_orm_1.asc)(doctor[element0[1]]);
                        orderByColumns.push(orderByFinal0);
                    }
                    else {
                        orderByFinal0 = (0, drizzle_orm_1.desc)(doctor[element0[1]]);
                        orderByColumns.push(orderByFinal0);
                    }
                    if (element1[0] === "asc") {
                        orderByFinal1 = (0, drizzle_orm_1.asc)(doctor[element1[1]]);
                        orderByColumns.push(orderByFinal1);
                    }
                    else {
                        orderByFinal1 = (0, drizzle_orm_1.desc)(doctor[element1[1]]);
                        orderByColumns.push(orderByFinal1);
                    }
                }
                const appointmentSearchQuery = {
                    condition: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(appointment_model_1.appointmentTable.appointmentDateTime, startDate), (0, drizzle_orm_1.lte)(appointment_model_1.appointmentTable.appointmentDateTime, endDate), searchBy.length === 1
                        ? (0, drizzle_orm_1.ilike)(columnToSearchBy1, `${searchQuery}%`)
                        : searchBy.length === 2
                            ? (0, drizzle_orm_1.sql) `CONCAT(${columnToSearchBy1}, ' ', ${columnToSearchBy2}) ILIKE ${`${searchQuery}%`}`
                            : (0, drizzle_orm_1.sql) `TRUE`, doctorId
                        ? (0, drizzle_orm_1.eq)(doctor.userId, doctorId)
                        : patientId
                            ? (0, drizzle_orm_1.eq)(patient.userId, patientId)
                            : (0, drizzle_orm_1.sql) `TRUE`),
                };
                let offset = page * limit;
                const totalCount = yield this._drizzle
                    .select({ totalCount: (0, drizzle_orm_1.count)() })
                    .from(appointment_model_1.appointmentTable)
                    .innerJoin(doctor, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentDoctorId, doctor.userId))
                    .innerJoin(patient, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentPatientId, patient.userId))
                    .where(appointmentSearchQuery.condition);
                const data = yield this._drizzle
                    .select({
                    appointment: {
                        appointmentId: appointment_model_1.appointmentTable.appointmentId,
                        appointmentDoctorId: appointment_model_1.appointmentTable.appointmentDoctorId,
                        appointmentPatientId: appointment_model_1.appointmentTable.appointmentPatientId,
                        appointmentReason: appointment_model_1.appointmentTable.appointmentReason,
                        appointmentDateTime: appointment_model_1.appointmentTable.appointmentDateTime,
                        appointmentStatus: appointment_model_1.appointmentTable.appointmentStatus,
                        appointmentCancellationReason: appointment_model_1.appointmentTable.appointmentCancellationReason,
                    },
                    doctor: {
                        doctorId: doctor.userId,
                        doctorForename: doctor.userForename,
                        doctorSurname: doctor.userSurname,
                    },
                    patient: {
                        patientId: patient.userId,
                        patientForename: patient.userForename,
                        patientSurname: patient.userSurname,
                        patientEmail: patient.userEmail,
                    },
                })
                    .from(appointment_model_1.appointmentTable)
                    .innerJoin(doctor, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentDoctorId, doctor.userId))
                    .innerJoin(patient, (0, drizzle_orm_1.eq)(appointment_model_1.appointmentTable.appointmentPatientId, patient.userId))
                    .where(appointmentSearchQuery.condition)
                    .orderBy(...orderByColumns)
                    .limit(limit)
                    .offset(offset);
                // .where(ilike(patient.userForename, `${searchQuery}%`));
                return {
                    appointmentsRelatedData: data,
                    totalCount: totalCount[0].totalCount,
                    totalPages: Math.ceil(totalCount[0].totalCount / limit) - 1,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createAppointment(appointmentCreationAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(appointmentCreationAttributes);
        });
    }
    updateAppointment(appointmentId, appointmentUpdateAttributes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(appointmentId, appointmentUpdateAttributes);
        });
    }
    deleteAppointment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(appointmentId);
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
