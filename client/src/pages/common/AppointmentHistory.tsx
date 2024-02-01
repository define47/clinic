import axios from "axios";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

export const AppointmentHistory: FC = () => {
  const { appointmentId } = useParams();

  async function getAppointmentHistory() {
    try {
      const response = await axios.get(
        "http://192.168.2.16:40587/api/appointments-history",
        {
          params: {
            appointmentId,
          },
          withCredentials: true,
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAppointmentHistory();
  }, [appointmentId]);

  return <div>hello {appointmentId}</div>;
};
