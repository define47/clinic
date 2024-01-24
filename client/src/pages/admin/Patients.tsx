import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { patientRoleName, userPath } from "../../utils/dotenv";

export const Patients: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <GeneralTable URL={userPath} entity={patientRoleName} />
      </div>
    </div>
  );
};
