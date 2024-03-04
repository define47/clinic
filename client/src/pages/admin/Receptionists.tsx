import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { receptionistRoleName, usersAPIPath } from "../../utils/dotenv";

export const Receptionists: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={usersAPIPath} entity={receptionistRoleName} />
      </div>
    </div>
  );
};
