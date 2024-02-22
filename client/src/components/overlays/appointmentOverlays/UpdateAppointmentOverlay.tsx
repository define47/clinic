import {
  ChangeEvent,
  FC,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
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
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import {
  getItemByLanguageAndCollection,
  getItemInUserSelectedLanguageCode,
} from "../../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { StyledInputV2 } from "../../design/StyledInputV2";
import { capitalizeString } from "../../../utils/utils";

export const UpdateAppointmentOverlay: FC<UpdateAppointmentOverlayProps> = ({
  appointment,
  doctorData,
  patientData,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
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
        `${patientData.patientForename} ${patientData.patientSurname}`
      );
      // setSelectedAppointmentStatusName(appointment.appointmentStatus);
      setSelectedAppointmentStatusValue(appointment.appointmentStatus);
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

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isUpdateAppointmentOverlayVisible === true &&
          isUpdateAppointmentConfirmationDialogOverlayVisible === true
        )
          setIsUpdateAppointmentConfirmationDialogOverlayVisible(false);
        if (
          isUpdateAppointmentOverlayVisible === true &&
          isUpdateAppointmentConfirmationDialogOverlayVisible === false
        )
          setIsUpdateAppointmentOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isUpdateAppointmentOverlayVisible,
    isUpdateAppointmentConfirmationDialogOverlayVisible,
  ]);
  useEffect(() => {
    const found = getItemInUserSelectedLanguageCode(
      authenticatedUserDataState.language.languageCode,
      "appointmentStatuses",
      selectedAppointmentStatusName
    );

    if (found)
      console.log(
        "selectedAppointmentStatusName",
        // getItemInUserSelectedLanguageCode(
        //   authenticatedUserDataState.language.languageCode,
        //   "appointmentStatuses",
        //   selectedAppointmentStatusName
        // )!
        capitalizeString(found)
      );
  }, [selectedAppointmentStatusName, authenticatedUserDataState]);

  return (
    <>
      {isUpdateAppointmentOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text="Update Appointment">
          <PiPencil
            onClick={() => setIsUpdateAppointmentOverlayVisible(true)}
            className="z-50 text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isUpdateAppointmentOverlayVisible ? "visible" : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-3/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isUpdateAppointmentOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
        >
          <span className="flex justify-center mb-8">Update Appointment</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <UserPicker
                shouldDataBeFetched={false}
                label={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "appointmentTableColumnNames",
                  0
                )}
                roleName="doctor"
                selectedUserId={selectedDoctorId}
                setSelectedUserId={setSelectedDoctorId}
                selectedUserName={selectedDoctorName}
                setSelectedUserName={setSelectedDoctorName}
                disabled
                z="z-50"
              />
              <UserPicker
                shouldDataBeFetched={false}
                label={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "appointmentTableColumnNames",
                  1
                )}
                roleName="patient"
                selectedUserId={selectedPatientId}
                setSelectedUserId={setSelectedPatientId}
                selectedUserName={selectedPatientName}
                setSelectedUserName={setSelectedPatientName}
                disabled
                z="z-40"
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedBorderColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "border-green-700"
                    : "border-black"
                }
                focusedTextColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "focus:text-green-500"
                    : "focus:text-pink-500"
                }
                focusedBorderColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "focus:border-green-500"
                    : "focus:border-pink-500"
                }
                focusedBorderColorIconArea={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "border-green-500"
                    : "border-pink-500"
                }
                unfocusedLabelColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  appointmentToUpdate.appointmentReason.length > 0
                    ? "text-green-500"
                    : "text-pink-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="appointmentReason"
                styledInputValue={appointmentToUpdate.appointmentReason}
                onChangeStyledInput={handleStyledInputChange}
                label={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "appointmentTableColumnNames",
                  2
                )}
              />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
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

              {/* capitalizeString(
                getItemInUserSelectedLanguageCode(
                  authenticatedUserDataState.language.languageCode,
                  "appointmentStatuses",
                  "selectedAppointmentStatusName"
                )!
              ) */}
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

              {selectedAppointmentStatusValue === "canceled by patient" && (
                <StyledInputV2
                  styledInputWidth="w-full"
                  unfocusedTextColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "text-green-700"
                      : "text-black"
                  }
                  unfocusedBorderColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "border-green-700"
                      : "border-black"
                  }
                  focusedTextColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "focus:text-green-500"
                      : "focus:text-pink-500"
                  }
                  focusedBorderColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "focus:border-green-500"
                      : "focus:border-pink-500"
                  }
                  focusedBorderColorIconArea={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "border-green-500"
                      : "border-pink-500"
                  }
                  unfocusedLabelColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "text-green-700"
                      : "text-black"
                  }
                  unfocusedLabelBackgroundColor="bg-white"
                  focusedLabelColor={
                    appointmentToUpdate.appointmentCancellationReason &&
                    appointmentToUpdate.appointmentCancellationReason.length > 0
                      ? "text-green-500"
                      : "text-pink-500"
                  }
                  focusedLabelBackgroundColor="bg-white"
                  isDisabled={false}
                  name="appointmentCancellationReason"
                  styledInputValue={
                    appointmentToUpdate.appointmentCancellationReason!
                  }
                  onChangeStyledInput={handleStyledInputChange}
                  label={getItemByLanguageAndCollection(
                    authenticatedUserDataState.language.languageCode,
                    "appointmentTableColumnNames",
                    5
                  )}
                />
              )}
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
                ? "visible"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateAppointmentConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 rounded-xl flex items-center justify-center transition-all ${
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
