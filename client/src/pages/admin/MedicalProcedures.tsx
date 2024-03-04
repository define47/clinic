import { FC } from "react";
import { TreeTable } from "../../components/TreeTable";
import { medicalProceduresAPIPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalProcedures: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable
          URL={medicalProceduresAPIPath}
          entity={"medicalProcedure"}
        />
      </div>
    </div>
  );
};
