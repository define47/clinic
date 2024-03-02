import { FC } from "react";
import { MedicalProcedure, MedicalProcedureBodyProps } from "../../../types";
import { UpdateMedicalProcedureOverlay } from "../../overlays/medicalProcedureOverlays/UpdateMedicalProcedureOverlay";
import { DeleteMedicalProcedureOverlay } from "../../overlays/medicalProcedureOverlays/DeleteMedicalProcedureOverlay";

export const MedicalProcedureBody: FC<MedicalProcedureBodyProps> = ({
  tableRow,
  tableRowIndex,
  clickedTableRow,
  setClickedTableRow,
  currentPage,
  tableLimit,
  selectedMedicalSpecialityId,
}) => {
  return (
    <tr
      key={tableRow.medicalProcedureId}
      className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
        (clickedTableRow as MedicalProcedure)?.medicalProcedureId ===
          tableRow.medicalProcedureId &&
        "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
      }`}
      onClick={() => setClickedTableRow(tableRow)}
    >
      <td>{tableRowIndex + 1 + currentPage * tableLimit}</td>
      <td className="px-6 py-4 text-xs">{tableRow.medicalProcedureId}</td>
      <td className="px-6 py-4 text-xs">{tableRow.medicalProcedureName}</td>
      <td className="px-6 py-4 text-xs">{tableRow.medicalProcedurePrice}</td>
      <td className="h-14 flex items-center justify-center space-x-2 px-6 py-4 text-xs">
        <UpdateMedicalProcedureOverlay medicalProcedure={tableRow} />
        <DeleteMedicalProcedureOverlay
          medicalSpecialityId={selectedMedicalSpecialityId}
          medicalProcedure={tableRow}
        />
      </td>
    </tr>
  );
};
