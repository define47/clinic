import { FC, useEffect, useState } from "react";
import { GeneralDataCardProps } from "../../../types";
import axios from "axios";
import { generalDataPath } from "../../../utils/dotenv";
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
        console.log("result app", response.data.payload[0].appointmentCount);
      }
    }

    fetchGeneralData();
  }, []);

  useEffect(() => {
    console.log("result", result);
  }, [result]);

  return (
    <div className="w-full h-24 flex items-center justify-between bg-gradient-to-br from-pink-100 to-pink-200 shadow-xl bg-black/30 p-4 text-lg rounded-xl border border-gray-200">
      <div className="flex flex-col">
        <span>{generalDataCardTitle}</span>
        <span>{result}</span>
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
