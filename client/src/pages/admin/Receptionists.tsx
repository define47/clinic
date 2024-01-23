import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import {
  receptionistRoleId,
  receptionistRoleName,
  usersPath,
} from "../../utils/dotenv";

export const Receptionists: FC = () => {
  return (
    <div>
      <GeneralTable
        URL={usersPath}
        roleId={receptionistRoleId}
        roleName={receptionistRoleName}
      />
    </div>
  );
};
