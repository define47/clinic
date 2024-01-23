import { FC } from "react";
import { medicalSpecialityPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalSpecialities: FC = () => {
  return (
    <div>
      <GeneralTable URL={medicalSpecialityPath} entity={"medicalSpeciality"} />
    </div>
  );
};
