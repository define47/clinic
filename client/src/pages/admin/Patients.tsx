import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { patientRoleName, userPath } from "../../utils/dotenv";

export const Patients: FC = () => {
  return (
    <div>
      Patients
      <GeneralTable URL={userPath} entity={patientRoleName} />
    </div>
  );
};
