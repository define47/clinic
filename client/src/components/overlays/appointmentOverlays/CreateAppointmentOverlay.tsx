import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { Appointment } from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { StyledInput } from "../../design/StyledInput";
import { UserPicker } from "../../pickers/UserPicker";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { AppointmentStatusPicker } from "../../pickers/AppointmentStatusPicker";
import { appointmentsPath } from "../../../utils/dotenv";
import axios from "axios";

export const CreateAppointmentOverlay: FC = () => {
  const [
    isCreateAppointmentOverlayVisible,
    setIsCreateAppointmentOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isCreateAppointmentConfirmationDialogOverlayVisible,
    setIsCreateAppointmentConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [appointmentToCreate, setAppointmentToCreate] = useState<Appointment>({
    appointmentDoctorId: "",
    appointmentPatientId: "",
    appointmentReason: "",
    appointmentDateTime: "",
    appointmentStatus: "",
  });

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");

  const [defaultDate, setDefaultDate] = useState<string>("");
  const [defaultTime, setDefaultTime] = useState<string>("");

  const [selectedAppointmentStatusName, setSelectedAppointmentStatusName] =
    useState<string>("");
  const [selectedAppointmentStatusValue, setSelectedAppointmentStatusValue] =
    useState<string>("");

  useEffect(() => {
    const currentDate = new Date();
    if (isCreateAppointmentOverlayVisible) {
      setDefaultDate(currentDate.toISOString());
      setDefaultTime("08:00");
      // setSelectedDateTime(`${currentDate.toISOString()}T08:00:00:000Z`);
    }
  }, [isCreateAppointmentOverlayVisible]);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAppointmentToCreate((prevAppointmentToCreate) => ({
      ...prevAppointmentToCreate,
      [name]: value,
    }));
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsCreateAppointmentOverlayVisible(false);
    }
  };

  async function onCreateAppointment() {
    try {
      const response = await axios.post(
        appointmentsPath,
        {
          appointmentDoctorId: selectedDoctorId,
          appointmentPatientId: selectedPatientId,
          appointmentDateTime: selectedDateTime,
          appointmentReason: appointmentToCreate.appointmentReason,
          appointmentStatus: "scheduled",
        },
        { withCredentials: true }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   console.log(appointmentToCreate);
  //   console.log(selectedDateTime);
  // }, [appointmentToCreate, selectedDateTime]);

  return (
    <>
      <StyledRippleButton
        label={`Create Appointment`}
        type="create"
        onClick={() => setIsCreateAppointmentOverlayVisible(true)}
      />

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isCreateAppointmentOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isCreateAppointmentOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
        >
          <span className="flex justify-center mb-8">Create Appointment</span>
          <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <UserPicker
                label="select doctor"
                roleName="doctor"
                selectedUserId={selectedDoctorId}
                setSelectedUserId={setSelectedDoctorId}
                selectedUserName={selectedDoctorName}
                setSelectedUserName={setSelectedDoctorName}
                z="z-50"
              />
              <UserPicker
                label="select patient"
                roleName="patient"
                selectedUserId={selectedPatientId}
                setSelectedUserId={setSelectedPatientId}
                selectedUserName={selectedPatientName}
                setSelectedUserName={setSelectedPatientName}
                z="z-40"
              />
            </div>
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="appointment reason"
                name="appointmentReason"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue={`appointmentReason`}
              />
              <DateTimePicker
                label="Appointment Date Time"
                isDateOnly={false}
                selectedEntity={selectedDateTime}
                setSelectedEntity={setSelectedDateTime}
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                isOverlayVisible={isCreateAppointmentOverlayVisible}
                z="z-50"
              />
              {/* <AppointmentStatusPicker
                selectedAppointmentStatusName={selectedAppointmentStatusName}
                setSelectedAppointmentStatusName={
                  setSelectedAppointmentStatusName
                }
                selectedAppointmentStatusValue={selectedAppointmentStatusValue}
                setSelectedAppointmentStatusValue={
                  setSelectedAppointmentStatusValue
                }
                z="z-50"
              /> */}
            </div>
          </div>
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsCreateAppointmentConfirmationDialogOverlayVisible(true)
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsCreateAppointmentOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isCreateAppointmentConfirmationDialogOverlayVisible
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsCreateAppointmentConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                isCreateAppointmentConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Create"
                type="yes"
                onClick={onCreateAppointment}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsCreateAppointmentConfirmationDialogOverlayVisible(false)
                }
              />
            </div>
          </ConfirmationDialogOverlay>
        </div>
      </Overlay>
    </>
  );
};
