import { FC } from "react";
import { TreeTable } from "../../components/TreeTable";
import { medicalProceduresPath } from "../../utils/dotenv";
import { GeneralTable } from "../../components/table/GeneralTable";

export const MedicalProcedures: FC = () => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <GeneralTable URL={medicalProceduresPath} entity={"medicalProcedure"} />
      </div>
    </div>
  );
};
