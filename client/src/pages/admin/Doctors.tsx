import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleName, usersAPIPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={usersAPIPath} entity={doctorRoleName} />
      </div>
    </div>
  );
};
