import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { doctorRoleName, userPath } from "../../utils/dotenv";

export const Doctors: FC = () => {
  return (
    <div>
      <GeneralTable URL={userPath} entity={doctorRoleName} />
    </div>
  );
};
