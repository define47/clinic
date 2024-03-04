import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { usersAPIPath } from "../../utils/dotenv";

export const ReceptionistPatients: FC = () => {
  return (
    <div className="w-full h-full">
      Receptionist Patients
      <div className="w-full h-full">
        <GeneralTable URL={usersAPIPath} entity={"patient"} />
      </div>
    </div>
  );
};
