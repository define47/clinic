import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";
import { appointmentsPath } from "../../utils/dotenv";

export const DoctorAppointments: FC = () => {
  return (
    <div className="w-full h-full">
      Doctor Appointments
      <div className="w-full h-full">
        <GeneralTable URL={appointmentsPath} entity={"appointment"} />
      </div>
    </div>
  );
};
