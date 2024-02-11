import axios from "axios";
import { FC, useEffect, useState } from "react";
import { appointmentsPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";

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
  const [appointments, setAppointments] = useState<AppointmentTableData[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedWeekDates, setSelectedWeekDates] = useState<string[]>([]);

  async function getDoctorAppointments() {
    try {
      let queryParams = {};

      queryParams = {
        table: "doctor",
        searchBy: "userForename",
        searchQuery: "",
        scheduleFilter: "custom",
        customStartDate: startWeek,
        customEndDate: endWeek,
        orderBy: "asc:userForename, asc:userSurname",
        limit: 99999999,
        page: 0,
        doctorId,
        patientId: "",
      };

      const response = await axios.get(appointmentsPath, {
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

  useEffect(() => {
    getDoctorAppointments();
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

  // ${
  //   dayIndex % 2 === 0 && "border-x"
  // }
  return (
    <>
      {doctorId !== "" && (
        <div className="w-full h-full">
          <table className="w-full h-full">
            <thead>
              <tr className="">
                <th className="w-10 h-10 bg-white border border-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor text-xs">
                  Times
                </th>
                {days.map((_, dayIndex: number) => (
                  <th
                    key={dayIndex}
                    className="h-10 bg-white border border-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor text-xs"
                  >
                    <div
                      className={`w-full flex flex-col items-center justify-center text-gray-600`}
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
                    className={`w-10 h-40 border border-gray-200 ${
                      timeSlotIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                    } text-center text-gray-600 font-bold text-xs`}
                  >
                    {timeSlot}
                  </td>
                  {days.map((_, dayIndex: number) => (
                    // border border-gray-200
                    <td className="w-40 h-40 border border-gray-200 odd:bg-gray-100 even:bg-gray-50">
                      {appointments.map(
                        (appointment: AppointmentTableData) =>
                          getDayIndex(
                            appointment.appointment.appointmentDateTime.split(
                              "T"
                            )[0]
                          ) === dayIndex &&
                          appointment.appointment.appointmentDateTime
                            .split("T")[1]
                            .substring(0, 5) === timeSlot && (
                            <div>
                              {appointment.appointment.appointmentDateTime}
                            </div>
                          )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
