import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleName, usersPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <GeneralTable URL={usersPath} entity={doctorRoleName} />
      </div>
    </div>
  );
};
