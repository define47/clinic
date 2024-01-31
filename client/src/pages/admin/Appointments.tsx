import { FC } from "react";
import { GeneralTable } from "../../components/table/GeneralTable";

export const Appointments: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full p-4">
        <GeneralTable
          URL={"http://192.168.2.16:40587/api/appointments"}
          entity={"appointment"}
        />
      </div>
    </div>
  );
};
