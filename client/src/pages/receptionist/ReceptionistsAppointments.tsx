import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { appointmentsPath } from "../../utils/dotenv";

export const ReceptionistsAppointments: FC = () => {
  return (
    <div className="w-full h-full">
      Receptionist Appointments
      <div className="w-full h-full">
        <GeneralTable URL={appointmentsPath} entity={"appointment"} />
      </div>
    </div>
  );
};
