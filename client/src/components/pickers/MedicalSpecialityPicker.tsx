import { FC, useState } from "react";
import { MedicalSpeciality } from "../../types";
import axios from "axios";
import { medicalSpecialityPath } from "../../utils/dotenv";

export const MedicalSpecialityPicker: FC = () => {
  const [medicalSpecialties, setMedicalSpecialities] = useState<
    MedicalSpeciality[]
  >([]);

  async function getMedicalSpecialities() {
    try {
      const response = await axios.get(medicalSpecialityPath, {
        params: {
          searchQuery: "",
          limit: 9999999,
          page: 0,
        },
        withCredentials: true,
      });

      if (response.data.success)
        setMedicalSpecialities(response.data.payload.tableData);
    } catch (error) {
      console.log(error);
    }
  }
  return <div></div>;
};
