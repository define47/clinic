import { FC } from "react";
import { medicalSpecialitiesPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalSpecialities: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable
          URL={medicalSpecialitiesPath}
          entity={"medicalSpeciality"}
        />
      </div>
    </div>
  );
};
