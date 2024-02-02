import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleName, usersPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={usersPath} entity={doctorRoleName} />
      </div>
    </div>
  );
};
