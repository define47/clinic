import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { receptionistRoleName, usersPath } from "../../utils/dotenv";

export const Receptionists: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <GeneralTable URL={usersPath} entity={receptionistRoleName} />
      </div>
    </div>
  );
};
