import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { receptionistRoleName, userPath } from "../../utils/dotenv";

export const Receptionists: FC = () => {
  return (
    <div>
      <GeneralTable URL={userPath} entity={receptionistRoleName} />
    </div>
  );
};
