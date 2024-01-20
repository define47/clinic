import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { patientRoleId, usersPath } from "../../utils/dotenv";

export const Patients: FC = () => {
  console.log(patientRoleId);

  return (
    <div>
      Patients
      <GeneralTable URL={usersPath} roleId={patientRoleId} />
    </div>
  );
};
