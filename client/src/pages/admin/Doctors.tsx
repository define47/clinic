import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleId, doctorRoleName, usersPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div>
      <GeneralTable
        URL={usersPath}
        roleId={doctorRoleId}
        roleName={doctorRoleName}
      />
    </div>
  );
};
