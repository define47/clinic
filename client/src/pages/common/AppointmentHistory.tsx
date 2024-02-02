import axios from "axios";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AppointmentHistory: FC = () => {
  const navigate = useNavigate();
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

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAppointmentHistory();
  }, [appointmentId]);

  return (
    <div>
      <span
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </span>
      hello {appointmentId}
    </div>
  );
};
