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
        customStartDate: "2024-05-01",
        customEndDate: "2024-11-09",
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
    console.log(appointments);
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

  useEffect(() => {
    console.log("timeslots", generateTimeSlots());
    setTimeSlots(generateTimeSlots());
  }, []);

  useEffect(() => {
    console.log("selectedWeekDates", selectedWeekDates);
  }, [selectedWeekDates]);

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

  return (
    <>
      {doctorId !== "" && (
        <div>
          <table>
            <thead>
              <tr>
                <th className="bg-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor">
                  Times
                </th>
                {days.map((_, index: number) => (
                  <th
                    key={index}
                    className="w-1 md:w-1/7 top-0 bg-gray-200 dark:bg-darkMode-sidebarColor dark:text-darkMode-tableHeaderTextColor text-xs"
                  >
                    {days[index]} &nbsp; ({selectedWeekDates[index]})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot: string, timeSlotIndex: number) => (
                <tr key={timeSlotIndex}>
                  <td>{timeSlot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
