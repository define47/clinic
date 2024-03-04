import { FC } from "react";
import { medicalSpecialitiesAPIPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalSpecialities: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable
          URL={medicalSpecialitiesAPIPath}
          entity={"medicalSpeciality"}
        />
      </div>
    </div>
  );
};
