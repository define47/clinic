import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { appointmentsPath } from "../../utils/dotenv";

export const Appointments: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={appointmentsPath} entity={"appointment"} />
      </div>
    </div>
  );
};
