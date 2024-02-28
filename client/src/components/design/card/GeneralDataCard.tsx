import { FC, useEffect, useState } from "react";
import { GeneralDataCardProps } from "../../../types";
import axios from "axios";
import { appointmentsPath, generalDataPath } from "../../../utils/dotenv";
import { RiUserHeartLine } from "react-icons/ri";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { GiBookmark } from "react-icons/gi";

export const GeneralDataCard: FC<GeneralDataCardProps> = ({
  generalDataCardTitle,
  entity,
  period,
  choice,
}) => {
  const [result, setResult] = useState<number>();
  const [amountOfCompletedAppointments, setAmountOfCompletedAppointments] =
    useState<number>(0);
  const [amountOfScheduledAppointments, setAmountOfScheduledAppointments] =
    useState<number>(0);
  useEffect(() => {
    async function fetchGeneralData() {
      let response;

      if (
        entity === "admin" ||
        entity === "doctor" ||
        entity === "patient" ||
        entity === "receptionist"
      ) {
        response = await axios.get(generalDataPath, {
          params: { entity },
          withCredentials: true,
        });

        if (response?.data.success) setResult(response.data.payload);
      } else if (entity === "appointment") {
        response = await axios.get(generalDataPath, {
          params: {
            entity,
            choice,
            period,
          },
          withCredentials: true,
        });

        if (response?.data.success)
          setResult(response.data.payload[0].appointmentCount);

        // const scheduledResp = await axios.get(appointmentsPath, {
        //   params: {
        //     message: "appointmentCountByPeriodAndStatus",
        //     period,
        //     appointmentStatus: "scheduled",
        //   },
        //   withCredentials: true,
        // });

        const completedResp = await axios.get(appointmentsPath, {
          params: {
            message: "appointmentCountByPeriodAndStatus",
            period,
            appointmentStatus: "completed",
          },
          withCredentials: true,
        });

        // console.log("payload", scheduledResp.data.payload);

        setAmountOfCompletedAppointments(
          completedResp.data.payload[0].appointmentCount
        );
        // setAmountOfScheduledAppointments(
        //   scheduledResp.data.payload[0].appointmentCount
        // );
      }
    }

    fetchGeneralData();
  }, []);

  useEffect(() => {
    console.log("result", result);
  }, [result]);

  return (
    <div className="w-full h-24 flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl bg-black/90 p-4 text-lg rounded-xl border border-gray-200">
      <div className="flex flex-col">
        <span>{generalDataCardTitle}</span>
        <span>{result}</span>
        {generalDataCardTitle === "Total Number of Appointments for Today" && (
          <div>comp {amountOfCompletedAppointments / result}</div>
        )}
      </div>
      {entity === "doctor" ? (
        <RiUserHeartLine className="text-3xl" />
      ) : entity === "patient" ? (
        <MdOutlinePersonalInjury className="text-3xl" />
      ) : entity === "receptionist" ? (
        <FaRegUser className="text-3xl" />
      ) : entity === "appointment" ? (
        <GiBookmark className="text-3xl" />
      ) : (
        ""
      )}
    </div>
  );
};
