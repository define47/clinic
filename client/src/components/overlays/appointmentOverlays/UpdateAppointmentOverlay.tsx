import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { Appointment, UpdateAppointmentOverlayProps } from "../../../types";
import Overlay from "../base/Overlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { UserPicker } from "../../pickers/UserPicker";
import { StyledInput } from "../../design/StyledInput";
import { AppointmentStatusPicker } from "../../pickers/AppointmentStatusPicker";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import axios from "axios";
import { appointmentsPath } from "../../../utils/dotenv";
import { Tooltip } from "../../design/Tooltip";

export const UpdateAppointmentOverlay: FC<UpdateAppointmentOverlayProps> = ({
  appointment,
  doctorData,
  patientData,
}) => {
  const [
    isUpdateAppointmentOverlayVisible,
    setIsUpdateAppointmentOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isUpdateAppointmentConfirmationDialogOverlayVisible,
    setIsUpdateAppointmentConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  const [appointmentToUpdate, setAppointmentToUpdate] = useState<Appointment>({
    appointmentId: "",
    appointmentDoctorId: "",
    appointmentPatientId: "",
    appointmentReason: "",
    appointmentDateTime: "",
    appointmentStatus: "",
    appointmentCancellationReason: "",
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  const [selectedAppointmentStatusName, setSelectedAppointmentStatusName] =
    useState<string>("");
  const [selectedAppointmentStatusValue, setSelectedAppointmentStatusValue] =
    useState<string>("");

  const [selectedDateTime, setSelectedDateTime] = useState<string>("");

  const [defaultDate, setDefaultDate] = useState<string>("");
  const [defaultTime, setDefaultTime] = useState<string>("");

  useEffect(() => {
    if (isUpdateAppointmentOverlayVisible) setAppointmentToUpdate(appointment);
  }, [isUpdateAppointmentOverlayVisible]);

  useEffect(() => {
    if (isUpdateAppointmentOverlayVisible) {
      setDefaultDate(appointment.appointmentDateTime.split("T")[0]);
      setDefaultTime(
        appointment.appointmentDateTime.split("T")[1].substring(0, 5)
      );
      setSelectedDoctorName(
        `${doctorData.doctorForename} ${doctorData.doctorSurname}`
      );
      setSelectedPatientName(
        `${patientData.patientForename} ${patientData.patientForename}`
      );
      setSelectedAppointmentStatusName(appointment.appointmentStatus);
    }
  }, [
    isUpdateAppointmentOverlayVisible,
    appointment,
    // appointmentToUpdate,
    // appointment.appointmentDateTime,
  ]);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAppointmentToUpdate((prevAppointmentToUpdate) => ({
      ...prevAppointmentToUpdate,
      [name]: value,
    }));
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsUpdateAppointmentOverlayVisible(false);
    }
  };

  async function onUpdateAppointment() {
    try {
      const response = await axios.put(
        appointmentsPath,
        {
          appointmentId: appointment.appointmentId,
          appointmentReason: appointmentToUpdate.appointmentReason,
          appointmentStatus: selectedAppointmentStatusValue,
          appointmentDateTime: selectedDateTime,
          appointmentCancellationReason:
            appointmentToUpdate.appointmentCancellationReason,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {isUpdateAppointmentOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text="Update Appointment">
          <PiPencil
            onClick={() => setIsUpdateAppointmentOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isUpdateAppointmentOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isUpdateAppointmentOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
        >
          <span className="flex justify-center mb-8">Update Appointment</span>
          <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <UserPicker
                label="select doctor"
                roleName="doctor"
                selectedUserId={selectedDoctorId}
                setSelectedUserId={setSelectedDoctorId}
                selectedUserName={selectedDoctorName}
                setSelectedUserName={setSelectedDoctorName}
                disabled
                z="z-50"
              />
              <UserPicker
                label="select patient"
                roleName="patient"
                selectedUserId={selectedPatientId}
                setSelectedUserId={setSelectedPatientId}
                selectedUserName={selectedPatientName}
                setSelectedUserName={setSelectedPatientName}
                disabled
                z="z-40"
              />
              <StyledInput
                label="appointment reason"
                name="appointmentReason"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={appointmentToUpdate.appointmentReason}
              />
            </div>
            <div className="flex flex-col space-y-6">
              <DateTimePicker
                label="Appointment Date Time"
                isDateOnly={false}
                selectedEntity={selectedDateTime}
                setSelectedEntity={setSelectedDateTime}
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                isOverlayVisible={isUpdateAppointmentOverlayVisible}
                z="z-50"
              />
              <AppointmentStatusPicker
                selectedAppointmentStatusName={selectedAppointmentStatusName}
                setSelectedAppointmentStatusName={
                  setSelectedAppointmentStatusName
                }
                selectedAppointmentStatusValue={selectedAppointmentStatusValue}
                setSelectedAppointmentStatusValue={
                  setSelectedAppointmentStatusValue
                }
                z="z-40"
              />
              <StyledInput
                label="appointment cancellation reason"
                name="appointmentCancellationReason"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={appointmentToUpdate.appointmentCancellationReason}
              />
            </div>
          </div>

          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsUpdateAppointmentConfirmationDialogOverlayVisible(true)
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsUpdateAppointmentOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isUpdateAppointmentConfirmationDialogOverlayVisible
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateAppointmentConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                isUpdateAppointmentConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Update"
                type="yes"
                onClick={onUpdateAppointment}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsUpdateAppointmentConfirmationDialogOverlayVisible(false)
                }
              />
            </div>
          </ConfirmationDialogOverlay>
        </div>
      </Overlay>
    </>
  );
};
