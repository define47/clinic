import { FC } from "react";
import { medicalSpecialityPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalSpecialities: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <GeneralTable
          URL={medicalSpecialityPath}
          entity={"medicalSpeciality"}
        />
      </div>
    </div>
  );
};
