import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { AppointmentBodyProps, AppointmentTableData } from "../../../types";
import { StyledAppointmentStatusName } from "../../design/StyledAppointmentStatusName";
import { CreateMedicalRecordPatientOverlay } from "../../overlays/medicalRecordPatientOverlays/CreateMedicalRecordPatientOverlay";
import { ViewMedicalRecordPatientOverlay } from "../../overlays/medicalRecordPatientOverlays/ViewMedicalRecordPatientOverlay";
import { UpdateAppointmentOverlay } from "../../overlays/appointmentOverlays/UpdateAppointmentOverlay";
import { DeleteAppointmentOverlay } from "../../overlays/appointmentOverlays/DeleteAppointmentOverlay";

import { RiTreasureMapLine } from "react-icons/ri";
import { SendEmailOverlay } from "../../overlays/emailOverlays/SendEmailOverlay";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "../../design/Tooltip";

export const AppointmentBody: FC<AppointmentBodyProps> = ({
  tableRow,
  tableRowIndex,
  clickedTableRow,
  setClickedTableRow,
  currentPage,
  tableLimit,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const navigate = useNavigate();
  return (
    <tr
      key={tableRow.appointment.appointmentId}
      className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
        (clickedTableRow as AppointmentTableData)?.appointment.appointmentId ===
          tableRow.appointment.appointmentId &&
        "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
      }`}
      onClick={() => setClickedTableRow(tableRow)}
    >
      <td>{tableRowIndex + 1 + currentPage * tableLimit}</td>
      <td className="px-6 py-4 text-xs">
        {tableRow.appointment.appointmentId}
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.doctor.doctorForename}&nbsp;
        {tableRow.doctor.doctorSurname}&nbsp;&nbsp;&nbsp;
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.patient.patientForename}&nbsp;
        {tableRow.patient.patientSurname}
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.appointment.appointmentReason}
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.appointment.appointmentDateTime
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-")}
        &nbsp;
        {tableRow.appointment.appointmentDateTime.split("T")[1].substring(0, 5)}
      </td>
      <td className="w-60 px-6 py-4 text-xs">
        <StyledAppointmentStatusName
          appointmentStatusName={tableRow.appointment.appointmentStatus}
        />
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.appointment.appointmentCancellationReason}
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.appointment.appointmentPrice}&nbsp;
        {tableRow.appointment.appointmentPrice && "RON"}
      </td>
      <td className="h-14 flex items-center justify-center space-x-2">
        {(authenticatedUserDataState.roleNames[0] === "doctor" ||
          authenticatedUserDataState.roleNames[1] === "doctor") &&
          tableRow.appointment.appointmentDoctorId ===
            authenticatedUserDataState.userId &&
          tableRow.appointment.appointmentStatus !== "completed" && (
            <CreateMedicalRecordPatientOverlay appointment={tableRow} />
          )}

        {(authenticatedUserDataState.roleNames[0] === "doctor" ||
          authenticatedUserDataState.roleNames[1] === "doctor") &&
          tableRow.appointment.appointmentDoctorId ===
            authenticatedUserDataState.userId &&
          tableRow.appointment.appointmentStatus === "completed" && (
            <ViewMedicalRecordPatientOverlay
              appointmentId={tableRow.appointment.appointmentId}
            />
          )}

        {tableRow.appointment.appointmentDoctorId !==
          authenticatedUserDataState.userId && <div className="w-5 h-14"></div>}

        {(authenticatedUserDataState.roleNames[0] === "admin" ||
          authenticatedUserDataState.roleNames[0] === "receptionist" ||
          authenticatedUserDataState.roleNames[1] === "admin") && (
          <UpdateAppointmentOverlay
            appointment={tableRow.appointment}
            doctorData={tableRow.doctor}
            patientData={tableRow.patient}
          />
        )}

        {(authenticatedUserDataState.roleNames[0] === "admin" ||
          authenticatedUserDataState.roleNames[0] === "receptionist" ||
          authenticatedUserDataState.roleNames[1] === "admin") && (
          <DeleteAppointmentOverlay
            appointmentId={tableRow.appointment.appointmentId}
          />
        )}

        <Tooltip text="View Appointment History">
          <RiTreasureMapLine
            className="text-xl hover:text-lightMode-sidebarItemIconColor hover:scale-125 cursor-pointer"
            onClick={() => {
              navigate(
                `/${authenticatedUserDataState.roleNames[0]}s/appointment-history/${tableRow.appointment.appointmentId}`
              );
              navigate(0);
            }}
          />
        </Tooltip>
        <SendEmailOverlay patientEmail={tableRow.patient.patientEmail} />
      </td>
    </tr>
  );
};
