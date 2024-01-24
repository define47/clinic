import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleName, userPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <GeneralTable URL={userPath} entity={doctorRoleName} />
      </div>
    </div>
  );
};
