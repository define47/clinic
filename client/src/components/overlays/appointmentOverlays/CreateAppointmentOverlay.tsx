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

export const CreateAppointmentOverlay: FC<CreateAppointmentOverlayProps> = ({
  isCreateAppointmentOverlayVisible,
  setIsCreateAppointmentOverlayVisible,
  timetableDoctorId,
  timetableDate,
  timetableTime,
}) => {
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
      {timetableDoctorId !== "" ? (
        ""
      ) : (
        <StyledRippleButton
          label={`Create Appointment`}
          type="create"
          onClick={() => setIsCreateAppointmentOverlayVisible(true)}
        />
      )}

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
              : "scale-125 opacity-0 duration-300"
          }`}
        >
          <span className="flex justify-center mb-8">Create Appointment</span>
          <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <UserPicker
                shouldDataBeFetched={true}
                label="select doctor"
                roleName="doctor"
                selectedUserId={selectedDoctorId}
                setSelectedUserId={setSelectedDoctorId}
                selectedUserName={selectedDoctorName}
                setSelectedUserName={setSelectedDoctorName}
                z="z-50"
                disabled={timetableDoctorId ? true : false}
              />
              <UserPicker
                shouldDataBeFetched={true}
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
                selectedEntity={selectedAppointmentDateTime}
                setSelectedEntity={setSelectedAppointmentDateTime}
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
