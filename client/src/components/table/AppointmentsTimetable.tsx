import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";
import { CardEntry } from "../design/card/CardEntry";
import { UpdateAppointmentOverlay } from "../overlays/appointmentOverlays/UpdateAppointmentOverlay";
import { DeleteAppointmentOverlay } from "../overlays/appointmentOverlays/DeleteAppointmentOverlay";
import { CreateAppointmentOverlay } from "../overlays/appointmentOverlays/CreateAppointmentOverlay";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";

type AppointmentTimetableProps = {
  doctorId: string;
  startWeek: string;
  endWeek: string;
};

export const AppointmentsTimetable: FC<AppointmentTimetableProps> = ({
  doctorId,
  startWeek,
  endWeek,
}) => {
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  const [appointments, setAppointments] = useState<AppointmentTableData[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedWeekDates, setSelectedWeekDates] = useState<string[]>([]);
  const [clickedTimetableSlot, setClickedTimetableSlot] = useState<string>();
  const [bookedAppointmentSlots, setBookedAppointmentSlots] = useState<
    string[]
  >([]);
  const [hasTimetableSlotAppointment, setHasTimetableSlotAppointment] =
    useState<boolean>();
  const [
    isCreateAppointmentOverlayVisible,
    setIsCreateAppointmentOverlayVisible,
  ] = useState<boolean>(false);
  const [selectedTimetableDate, setSelectedTimetableDate] =
    useState<string>("");
  const [selectedTimetableTime, setSelectedTimetableTime] =
    useState<string>("");

  useEffect(() => {
    console.log("startWeek", startWeek !== "", endWeek);
  }, [startWeek, endWeek]);

  useEffect(() => {
    async function getDoctorAppointments() {
      try {
        let queryParams = {};

        queryParams = {
          message: "appointments",
          searchInTable: "doctor",
          orderInTable: "appointment",
          searchBy: "userForename",
          searchQuery: "",
          scheduleFilter: "custom",
          // customStartDate: startWeek !== "" ? startWeek : "1234-01-01",
          // customEndDate: endWeek !== "" ? endWeek : "1234-01-01",
          customStartDate: startWeek,
          customEndDate: endWeek,
          orderBy: "asc:appointmentDateTime",
          limit: 99999999,
          page: 0,
          doctorId,
          patientId: "",
        };

        const response = await axios.get(appointmentsAPIPath, {
          params: {
            ...queryParams,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setAppointments(response.data.payload.tableData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (startWeek !== "" && endWeek !== "") getDoctorAppointments();
  }, [doctorId, startWeek, endWeek]);

  useEffect(() => {
    console.log("appointments timetable", appointments);
  }, [appointments]);

  function generateTimeSlots() {
    const timeSlots = [];
    let hour = 8;
    let minute = 0;

    while (hour <= 17) {
      timeSlots.push(
        `${hour < 10 ? "0" + hour : hour}:${
          minute === 0 ? "0" + minute : minute
        }`
      );

      minute += 15;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }

    return timeSlots;
  }

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  useEffect(() => {
    const dates: string[] = [];
    const startWeekDate = new Date(startWeek);
    const endWeekDate = new Date(endWeek);
    const date = new Date(startWeekDate);

    while (date <= endWeekDate) {
      dates.push(
        date.toISOString().split("T")[0].split("-").reverse().join("-")
      );
      date.setDate(date.getDate() + 1);
    }

    console.log(dates);
    setSelectedWeekDates(dates);
  }, [startWeek, endWeek]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getDayIndex(appointmentDate: string) {
    const date = new Date(appointmentDate);
    const day = date.getDay();
    const dayName = days[day];
    const dayIndex = days.indexOf(dayName) - 1;

    if (dayIndex === -1) return 6;
    return dayIndex;
  }

  function findAppointment(
    appointments: AppointmentTableData[],
    dayIndex: number,
    timeSlot: string
  ): AppointmentTableData | undefined {
    return appointments.find((appointment) => {
      return (
        getDayIndex(
          appointment.appointment.appointmentDateTime.split("T")[0]
        ) === dayIndex &&
        appointment.appointment.appointmentDateTime
          .split("T")[1]
          .substring(0, 5) === timeSlot
      );
    });
  }

  useEffect(() => {
    function getBookedAppointmentSlots() {
      return appointments.map(
        (appointment: AppointmentTableData) =>
          `${getDayIndex(
            appointment.appointment.appointmentDateTime.split("T")[0]
          )}-${appointment.appointment.appointmentDateTime
            .split("T")[1]
            .substring(0, 5)}`
      );
    }

    setBookedAppointmentSlots(getBookedAppointmentSlots());
  }, [appointments]);

  useEffect(() => {
    console.log("bookedAppointmentSlots", bookedAppointmentSlots);
  }, [bookedAppointmentSlots]);

  useEffect(() => {
    console.log(clickedTimetableSlot);
    const dayIndex = parseInt(clickedTimetableSlot?.split("-")[0]!);
    const timeSlot = clickedTimetableSlot?.split("-")[1];

    if (dayIndex !== undefined && timeSlot !== undefined) {
      const foundAppointment = findAppointment(
        appointments,
        dayIndex,
        timeSlot
      );
      console.log(foundAppointment);
      setHasTimetableSlotAppointment(foundAppointment !== undefined);
    }
  }, [clickedTimetableSlot]);

  useEffect(() => {
    console.log(hasTimetableSlotAppointment);
  }, [hasTimetableSlotAppointment]);

  useEffect(() => {
    if (socketNotificationDataState) {
      const receivedSocketData = JSON.parse(socketNotificationDataState);
      const receivedAction = receivedSocketData.action;
      const receivedEntity = receivedSocketData.entity;
      let receivedData = receivedSocketData.data;

      console.log("socket data", receivedData, "socket action", receivedAction);

      // console.log(
      //   "🚀 ~ useEffect ~ socketNotificationDataState:",
      //   receivedSocketData
      // );

      // console.log("🚀 ~ useEffect ~ action:", action);

      // console.log("receivedSocketData", data);

      if (
        receivedAction === "createAppointment" &&
        receivedEntity === "appointment" &&
        doctorId === receivedData.doctor.doctorId
      ) {
        receivedData = receivedData as AppointmentTableData;
        console.log("appointment data event", receivedData.doctor.doctorId);

        setAppointments((prevAppointments: AppointmentTableData[]) => [
          {
            // appointment: {
            // appointmentId: data.appointment.appointmentId,
            // appointmentDoctorId: data.appointment.appointmentDoctorId,
            // appointmentPatientId: data.appointment.appointmentPatientId,
            // appointmentReason: data.appointment.appointmentReason,
            // appointmentDateTime: data.appointment.appointmentDateTime,
            // appointmentStatus: data.appointment.appointmentStatus,
            // appointmentCancellationReason:
            //   data.appointment.appointmentCancellationReason,
            // },
            // doctor: {
            //   doctorId: data.doctor.doctorId,
            //   doctorForename: data.doctor.doctorForename,
            //   doctorSurname: data.doctor.doctorSurname,
            // },
            // patient: {
            //   patientId: data.patientId.patientId,
            //   patientForename: data.patientId.patientForename,
            //   patientSurname: data.patientId.patientSurname,
            //   patientEmail: data.patientId.patientEmail,
            // },
            ...receivedData,
          } as AppointmentTableData,
          ...prevAppointments,
        ]);
      } else if (receivedAction === "updateAppointment") {
        receivedData = receivedData as AppointmentTableData;

        console.log("data medical procedure update", receivedData);

        setAppointments((prevAppointments: AppointmentTableData[]) => {
          const updatedEvents = prevAppointments.map(
            (event: AppointmentTableData) => {
              if (
                event.appointment.appointmentId ===
                receivedData.appointment.appointmentId
              ) {
                return {
                  ...event,
                  ...receivedData,
                };
              } else {
                return event;
              }
            }
          );
          return updatedEvents;
        });
      } else if (receivedAction === "deleteAppointment") {
        console.log("data to delete", receivedData);

        setAppointments((prevAppointments: AppointmentTableData[]) =>
          prevAppointments.filter((appointment: AppointmentTableData) => {
            // if ('appointmentId' in appointment.appointment) {
            return (
              (appointment as AppointmentTableData).appointment
                .appointmentId !== receivedData
            );
            // }
            // return true;
          })
        );
      }
    }

    // if (
    //   socketNotificationDataState &&
    //   socketNotificationDataState !== undefined
    // ) {
    //   console.log("Received Data:", socketNotificationDataState);
    //   let receivedData = socketNotificationDataState;
    //   console.log(
    //     "🚀 ~ useEffect ~ receivedData:",
    //     JSON.parse(
    //       (receivedData as unknown as MedicalSpeciality).medicalSpecialityName
    //     )
    //   );
    // }

    // setTableRows((prevUsers: TableRow[]) => [
    //   {
    //     userId: "userIdTest",
    //     userForename: "",
    //     userSurname: "",
    //     userEmail: "",
    //     userPhoneNumber: "",
    //     userGender: "",
    //     userDateOfBirth: "",
    //     userAddress: "",
    //     userEncryptedPassword: "",
    //     isUserEmailActivated: false,
    //     isUserApprovedByAdmin: false,
    //     isUserBanned: false,
    //     userRoleId: "",
    //     userRoleName: "",
    //   } as User,
    //   ...prevUsers,
    // ]);
  }, [socketNotificationDataState, doctorId]);

  return (
    <>
      {doctorId !== "" && (
        <div className="w-full h-full">
          <table className="w-full h-full">
            <thead className="sticky top-0 z-50">
              <tr className="">
                <th className="bg-white border border-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor text-xs">
                  Times
                </th>
                {days.map((_, dayIndex: number) => (
                  <th
                    key={dayIndex}
                    className="h-10 bg-white border border-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor text-xs"
                  >
                    <div
                      className={`w-full flex flex-col -space-y-2 items-center justify-center text-gray-600`}
                    >
                      <span>{days[dayIndex]}</span>
                      &nbsp;
                      <span>({selectedWeekDates[dayIndex]})</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot: string, timeSlotIndex: number) => (
                <tr className="bg-white" key={timeSlotIndex}>
                  <td
                    className={`w-1 border border-gray-200 ${
                      timeSlotIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                    } text-center text-gray-600 font-bold text-xs`}
                  >
                    {timeSlot}
                  </td>
                  {days.map((_, dayIndex: number) => {
                    const foundAppointment = findAppointment(
                      appointments,
                      dayIndex,
                      timeSlot
                    );
                    return (
                      <td
                        className={`w-1/7 h-auto border border-gray-300 odd:bg-gray-100 even:bg-gray-50 transition-all ${
                          clickedTimetableSlot === `${dayIndex}-${timeSlot}`
                            ? hasTimetableSlotAppointment
                              ? "!bg-pink-400 duration-500"
                              : "!bg-emerald-300 duration-500"
                            : ""
                        }`}
                        onClick={() => {
                          setClickedTimetableSlot(`${dayIndex}-${timeSlot}`);
                          setSelectedTimetableDate(
                            `${selectedWeekDates[dayIndex]
                              .split("-")
                              .reverse()
                              .join("-")}`
                          );
                          setSelectedTimetableTime(timeSlot);
                        }}
                        onDoubleClick={() => {
                          setClickedTimetableSlot(`${dayIndex}-${timeSlot}`);
                          if (!hasTimetableSlotAppointment)
                            setIsCreateAppointmentOverlayVisible(true);
                        }}
                      >
                        {/* {appointments.map((appointment: AppointmentTableData) =>
                        getDayIndex(
                          appointment.appointment.appointmentDateTime.split(
                            "T"
                          )[0]
                        ) === dayIndex &&
                        appointment.appointment.appointmentDateTime
                          .split("T")[1]
                          .substring(0, 5) === timeSlot ? (
                          <div
                          absolute top-0 w-full
                          className="w-0 h-auto border rounded-xl !bg-white text-xs z-10"
                          onClick={() => {
                            setClickedTimetableSlot(
                              appointment.appointment.appointmentId
                            );
                          }}
                          >
                          <div className="w-full h-full flex flex-col bg-white">
                            <CardEntry
                              cardEntryTitle="Doctor"
                              cardEntryData={`${appointment.doctor.doctorForename} ${appointment.doctor.doctorSurname}`}
                            />
                            <CardEntry
                              cardEntryTitle="Patient"
                              cardEntryData={`${appointment.patient.patientForename} ${appointment.patient.patientForename}`}
                            />
                            <CardEntry
                              cardEntryTitle="Appointment Reason"
                              cardEntryData={`${appointment.appointment.appointmentReason}`}
                            />
                            <CardEntry
                              cardEntryTitle="Appointment Date Time"
                              cardEntryData={`${appointment.appointment.appointmentDateTime
                                .split("T")[0]
                                .split("-")
                                .reverse()
                                .join(
                                  "-"
                                )} ${appointment.appointment.appointmentDateTime
                                .split("T")[1]
                                .substring(0, 5)}`}
                            />
                            <CardEntry
                              cardEntryTitle="Appointment Status"
                              cardEntryData={`${appointment.appointment.appointmentStatus}`}
                              cardEntryType="appointmentStatus"
                            />
                            <CardEntry
                              cardEntryTitle="Appointment Cancellation Reason"
                              cardEntryData={`${appointment.appointment.appointmentCancellationReason}`}
                            />
                            <div className="p-3 w-full h-10 flex items-center justify-between border-b text-xs">
                              <span className="w-1/2 font-semibold text-center">
                                Actions
                              </span>
                              <div
                                className={`w-56 flex items-center justify-center text-center space-x-3`}
                              >
                                <UpdateAppointmentOverlay
                                  appointment={appointment.appointment}
                                  doctorData={appointment.doctor}
                                  patientData={appointment.patient}
                                />

                                <DeleteAppointmentOverlay
                                  appointmentId={
                                    appointment.appointment.appointmentId
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // </div>
                          <div
                            className="w-full"
                            className="absolute top-0 w-full h-full border rounded-xl bg-white text-xs z-10"
                            onClick={() => {
                              setClickedTimetableSlot(
                                `${dayIndex}-${timeSlotIndex}`
                              );
                            }}
                          >
                            N/A
                          </div>
                        )
                      )} */}
                        <div>
                          {/* {days[dayIndex]}-{timeSlot} */}
                          {/* {findAppointment(appointments, dayIndex, timeSlot) !==
                        undefined
                          ? "a"
                          : "N/A"} */}
                          {/* {(() => {
                          const foundAppointment = findAppointment(
                            appointments,
                            dayIndex,
                            timeSlot
                          );
                          return foundAppointment !== undefined ? (
                            <>
                              <span>a</span>
                              <span>
                                {
                                  foundAppointment.appointment
                                    .appointmentDateTime
                                }
                              </span>
                            </>
                          ) : (
                            "N/A"
                          );
                        })()} */}
                          {foundAppointment !== undefined ? (
                            <div className="w-full h-96">
                              <div className="w-full h-full flex flex-col bg-white">
                                <CardEntry
                                  cardEntryTitle="Doctor"
                                  cardEntryData={`${foundAppointment.doctor.doctorForename} ${foundAppointment.doctor.doctorSurname}`}
                                />
                                <CardEntry
                                  cardEntryTitle="Patient"
                                  cardEntryData={`${foundAppointment.patient.patientForename} ${foundAppointment.patient.patientForename}`}
                                />
                                <CardEntry
                                  cardEntryTitle="Reason"
                                  cardEntryData={`${foundAppointment.appointment.appointmentReason}`}
                                />
                                <CardEntry
                                  cardEntryTitle="Date Time"
                                  cardEntryData={`${foundAppointment.appointment.appointmentDateTime
                                    .split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join(
                                      "-"
                                    )} ${foundAppointment.appointment.appointmentDateTime
                                    .split("T")[1]
                                    .substring(0, 5)}`}
                                />
                                <CardEntry
                                  cardEntryTitle="Status"
                                  cardEntryData={`${foundAppointment.appointment.appointmentStatus}`}
                                  cardEntryType="appointmentStatus"
                                />
                                <CardEntry
                                  cardEntryTitle="Cancellation Reason"
                                  cardEntryData={`${foundAppointment.appointment.appointmentCancellationReason}`}
                                />
                                <div className="p-3 w-full h-10 flex items-center justify-between border-b text-xs">
                                  <span className="w-1/3 font-semibold text-center">
                                    Actions
                                  </span>
                                  <div
                                    className={`w-2/3 flex items-center justify-center text-center space-x-3`}
                                  >
                                    <UpdateAppointmentOverlay
                                      appointment={foundAppointment.appointment}
                                      doctorData={foundAppointment.doctor}
                                      patientData={foundAppointment.patient}
                                    />

                                    <DeleteAppointmentOverlay
                                      appointmentId={
                                        foundAppointment.appointment
                                          .appointmentId
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-96 invisible">
                              N/A Lorem ipsum, dolor sit amet consectetur
                              adipisicing elit. Amet, maxime corporis!
                              Provident, mollitia sit. Cumque dolorem culpa
                              quasi, iure officia qui porro recusandae ducimus.
                              Libero exercitationem repellendus impedit maxime
                              quia!
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!hasTimetableSlotAppointment && (
        <CreateAppointmentOverlay
          isCreateAppointmentOverlayVisible={isCreateAppointmentOverlayVisible}
          timetableDate={selectedTimetableDate}
          timetableTime={selectedTimetableTime}
          setIsCreateAppointmentOverlayVisible={
            setIsCreateAppointmentOverlayVisible
          }
          timetableDoctorId={doctorId}
        />
      )}
    </>
  );
};
