import {
  ChangeEvent,
  FC,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Appointment,
  BookedDoctorAppointmentSlot,
  CreateAppointmentOverlayProps,
} from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { StyledInput } from "../../design/StyledInput";
import { UserPicker } from "../../pickers/UserPicker";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { AppointmentStatusPicker } from "../../pickers/AppointmentStatusPicker";
import {
  appointmentsDoctorAvailabilityPath,
  appointmentsPath,
} from "../../../utils/dotenv";
import axios from "axios";
import { SocketNotificationDataContext } from "../../../contexts/SocketNotificationContext";
import { StyledInputV2 } from "../../design/StyledInputV2";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";

export const CreateAppointmentOverlay: FC<CreateAppointmentOverlayProps> = ({
  isCreateAppointmentOverlayVisible,
  setIsCreateAppointmentOverlayVisible,
  timetableDoctorId,
  timetableDate,
  timetableTime,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  // const [
  //   isCreateAppointmentOverlayVisible,
  //   setIsCreateAppointmentOverlayVisible,
  // ] = useState<boolean>(false);
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
  const [bookedDoctorAppointmentSlots, setBookedDoctorAppointmentSlots] =
    useState<BookedDoctorAppointmentSlot[]>([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedAppointmentDateTime, setSelectedAppointmentDateTime] =
    useState<string>("");

  const [isSelectedDoctorIdValid, setIsSelectedDoctorIdValid] =
    useState<boolean>(false);
  const [isSelectedPatientIdValid, setIsSelectedPatientIdValid] =
    useState<boolean>(false);

  const [defaultDate, setDefaultDate] = useState<string>("");
  const [defaultTime, setDefaultTime] = useState<string>("");

  const [selectedAppointmentStatusName, setSelectedAppointmentStatusName] =
    useState<string>("");
  const [selectedAppointmentStatusValue, setSelectedAppointmentStatusValue] =
    useState<string>("");

  useEffect(() => {
    if (timetableDoctorId) setSelectedDoctorId(timetableDoctorId);

    if (timetableDate) setDefaultDate(timetableDate);
    if (timetableTime) setDefaultTime(timetableTime);
    console.log("selected", timetableDate, timetableTime);
  }, [timetableDoctorId, timetableDate, timetableTime]);

  useEffect(() => {
    const currentDate = new Date();
    if (
      isCreateAppointmentOverlayVisible &&
      !timetableDoctorId &&
      !timetableDate &&
      !timetableTime
    ) {
      setDefaultDate(currentDate.toISOString());
      setDefaultTime("08:00");
      // setSelectedDateTime(`${currentDate.toISOString()}T08:00:00:000Z`);
    }
  }, [
    isCreateAppointmentOverlayVisible,
    timetableDoctorId,
    timetableDate,
    timetableTime,
  ]);

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
          appointmentDateTime: selectedAppointmentDateTime,
          appointmentReason: appointmentToCreate.appointmentReason,
          appointmentStatus: "scheduled",
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getDoctorAppointmentAvailability() {
      try {
        if (selectedDoctorId) {
          const response = await axios.get(appointmentsDoctorAvailabilityPath, {
            params: {
              doctorId: selectedDoctorId,
              date: selectedAppointmentDateTime.split("T")[0],
            },
            withCredentials: true,
          });

          if (response.data.success)
            setBookedDoctorAppointmentSlots(response.data.payload);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getDoctorAppointmentAvailability();
  }, [selectedDoctorId, selectedAppointmentDateTime]);

  useEffect(() => {
    if (socketNotificationDataState) {
      const receivedSocketData = JSON.parse(socketNotificationDataState);
      const action = receivedSocketData.action;
      const data = receivedSocketData.data;

      if (action === "createAppointment") {
        if (
          data.appointment.appointmentDoctorId === selectedDoctorId &&
          data.appointment.appointmentDateTime.split("T")[0] ===
            selectedAppointmentDateTime.split("T")[0]
        )
          setBookedDoctorAppointmentSlots(
            (prevBookedSlots: BookedDoctorAppointmentSlot[]) => [
              {
                appointmentDateTime: data.appointment.appointmentDateTime,
              } as BookedDoctorAppointmentSlot,
              ...prevBookedSlots,
            ]
          );
      } else if (action === "updateAppointment") {
        console.log("updateAppointment slots", data);

        setBookedDoctorAppointmentSlots(
          (prevBookedDoctorAppointmentSlots: BookedDoctorAppointmentSlot[]) => {
            const updatedEvents = prevBookedDoctorAppointmentSlots.map(
              (event: BookedDoctorAppointmentSlot) => {
                console.log("event.appointmentId", event.appointmentId);

                if (event.appointmentId === data.appointment.appointmentId) {
                  return {
                    ...event,
                    appointmentId: data.appointment.appointmentId,
                    appointmentDateTime: data.appointment.appointmentDateTime,
                  };
                } else {
                  return event;
                }
              }
            );
            return updatedEvents;
          }
        );
      } else if (action === "deleteAppointment") {
        setBookedDoctorAppointmentSlots(
          (prevBookedSlots: BookedDoctorAppointmentSlot[]) =>
            prevBookedSlots.filter(
              (prevBookedSlot: BookedDoctorAppointmentSlot) => {
                console.log("prevBookedSlot", prevBookedSlot);

                return prevBookedSlot.appointmentId !== data;
              }
            )
        );
      }
    }
  }, [
    socketNotificationDataState,
    selectedDoctorId,
    selectedAppointmentDateTime,
  ]);

  useEffect(() => {
    console.log("selectedDoctorId", selectedDoctorId);
  }, [selectedDoctorId]);

  return (
    <>
      {timetableDoctorId !== undefined ? (
        ""
      ) : (
        <StyledRippleButton
          label={`Create Appointment`}
          type="create"
          onClick={() => setIsCreateAppointmentOverlayVisible(true)}
        />
      )}
      {/* <StyledRippleButton
        label={`Create Appointment`}
        type="create"
        onClick={() => setIsCreateAppointmentOverlayVisible(true)}
      /> */}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isCreateAppointmentOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-3/4 lg:h-1/2 rounded-xl shadow p-6 bg-white border border-gray-500 transition-all ${
            isCreateAppointmentOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
        >
          <span className="flex justify-center mb-8">Create Appointment</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <UserPicker
                shouldDataBeFetched={true}
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
                z="z-40"
                disabled={timetableDoctorId ? true : false}
              />
              <UserPicker
                shouldDataBeFetched={true}
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
                z="z-30"
              />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <DateTimePicker
                label="Appointment Date Time"
                isDateOnly={false}
                selectedEntity={selectedAppointmentDateTime}
                setSelectedEntity={setSelectedAppointmentDateTime}
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                isOverlayVisible={isCreateAppointmentOverlayVisible}
                z="z-20"
                isDisabled={timetableDoctorId !== undefined ? true : false}
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedBorderColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "border-green-700"
                    : "border-black"
                }
                focusedTextColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "focus:text-green-500"
                    : "focus:text-pink-500"
                }
                focusedBorderColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "focus:border-green-500"
                    : "focus:border-pink-500"
                }
                focusedBorderColorIconArea={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "border-green-500"
                    : "border-pink-500"
                }
                unfocusedLabelColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  appointmentToCreate.appointmentReason.length > 0
                    ? "text-green-500"
                    : "text-pink-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="appointmentReason"
                styledInputValue={appointmentToCreate.appointmentReason}
                onChangeStyledInput={handleStyledInputChange}
                label={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "appointmentTableColumnNames",
                  2
                )}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <span
              className={`mb-3 transition-all ${
                selectedDoctorId
                  ? "scale-100 opacity-100 duration-500"
                  : "scale-125 opacity-0 duration-500"
              }`}
            >
              Already Booked Appointments
            </span>

            <div
              className={`grid grid-cols-4 w-96 ${
                bookedDoctorAppointmentSlots.length > 0 && selectedDoctorId
                  ? "scale-100 opacity-100 duration-500"
                  : "scale-125 opacity-0 duration-500"
              }`}
            >
              {bookedDoctorAppointmentSlots.map(
                (
                  doctorAppointmentAvailability: BookedDoctorAppointmentSlot,
                  doctorAppointmentAvailabilityIndex: number
                ) => (
                  <span key={doctorAppointmentAvailability.appointmentId}>
                    {doctorAppointmentAvailability.appointmentDateTime
                      .split("T")[1]
                      .substring(0, 5)}
                    {doctorAppointmentAvailabilityIndex !==
                      bookedDoctorAppointmentSlots.length - 1 && ","}
                    {/* {doctorAppointmentAvailability.appointmentDateTime} */}
                  </span>
                )
              )}
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
