import { ChangeEvent, FC, MouseEvent, useState } from "react";
import { Appointment } from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";

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
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");

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
            <div className="flex flex-col space-y-6"></div>
          </div>
        </div>
      </Overlay>
    </>
  );
};
