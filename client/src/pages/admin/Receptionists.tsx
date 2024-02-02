import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { receptionistRoleName, usersPath } from "../../utils/dotenv";

export const Receptionists: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={usersPath} entity={receptionistRoleName} />
      </div>
    </div>
  );
};
