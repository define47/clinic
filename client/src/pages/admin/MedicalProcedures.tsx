import { FC } from "react";
import { TreeTable } from "../../components/TreeTable";

export const MedicalProcedures: FC = () => {
  return (
    <div className="w-full">
      <div className="w-full p-4">
        <TreeTable />
      </div>
    </div>
  );
};
