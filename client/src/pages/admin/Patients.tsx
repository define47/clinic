import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { patientRoleName, usersAPIPath } from "../../utils/dotenv";

export const Patients: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={usersAPIPath} entity={patientRoleName} />
      </div>
    </div>
  );
};
