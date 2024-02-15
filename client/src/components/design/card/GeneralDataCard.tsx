import { FC, useEffect, useState } from "react";
import { GeneralDataCardProps } from "../../../types";
import axios from "axios";
import { generalDataPath } from "../../../utils/dotenv";

export const GeneralDataCard: FC<GeneralDataCardProps> = ({
  entity,
  period,
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
      }

      console.log("result", response);

      if (response?.data.success) setResult(response.data.payload);
    }

    fetchGeneralData();
  }, []);

  useEffect(() => {
    console.log("result", result);
  }, [result]);

  return <div>{result}</div>;
};
