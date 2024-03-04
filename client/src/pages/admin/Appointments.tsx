import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { appointmentsAPIPath } from "../../utils/dotenv";

export const Appointments: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={appointmentsAPIPath} entity={"appointment"} />
      </div>
    </div>
  );
};
