import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { appointmentsAPIPath } from "../../utils/dotenv";

export const ReceptionistsAppointments: FC = () => {
  return (
    <div className="w-full h-full">
      Receptionist Appointments
      <div className="w-full h-full">
        <GeneralTable URL={appointmentsAPIPath} entity={"appointment"} />
      </div>
    </div>
  );
};
