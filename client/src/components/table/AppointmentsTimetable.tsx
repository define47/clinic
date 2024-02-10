import axios from "axios";
import { FC, useEffect, useState } from "react";
import { appointmentsPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";

export const AppointmentsTimetable: FC = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<AppointmentTableData[]>([]);

  async function getDoctorAppointments() {
    try {
      let queryParams = {};

      queryParams = {
        table: "doctor",
        searchBy: "userForename",
        searchQuery: "",
        scheduleFilter: "custom",
        customStartDate: "2024-01-01",
        customEndDate: "2024-12-09",
        orderBy: "asc:userForename, asc:userSurname",
        limit: 99999999,
        page: 0,
        doctorId: "7985f290-f148-5d3c-91c9-d0966e12ba79",
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
  }, []);

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
    console.log("timeslots", generateTimeSlots());
    setTimeSlots(generateTimeSlots());
  }, []);

  return <div></div>;
};
