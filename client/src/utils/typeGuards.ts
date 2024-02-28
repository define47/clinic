import {
  AppointmentTableData,
  MedicalProcedure,
  MedicalSpeciality,
  Patient,
  TableRow,
  User,
} from "../types";

export function isUserRow(tableRow: TableRow): tableRow is User {
  return "userId" in tableRow;
}

export function isMedicalSpecialityRow(
  tableRow: TableRow
): tableRow is MedicalSpeciality {
  return "medicalSpecialityId" in tableRow;
}

export function isAppointmentRow(
  tableRow: TableRow
): tableRow is AppointmentTableData {
  return "appointment" in tableRow && "appointmentId" in tableRow.appointment;
}

export function isMedicalProcedureRow(
  tableRow: TableRow
): tableRow is MedicalProcedure {
  return "medicalProcedureId" in tableRow;
}
