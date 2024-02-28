import { FC } from "react";
import { MedicalSpeciality, MedicalSpecialityBodyProps } from "../../../types";
import { UpdateMedicalSpeciality } from "../../overlays/medicalSpecialityOverlays/UpdateMedicalSpeciality";
import { DeleteMedicalSpecialityOverlay } from "../../overlays/medicalSpecialityOverlays/DeleteMedicalSpecialityOverlay";

export const MedicalSpecialityBody: FC<MedicalSpecialityBodyProps> = ({
  tableRow,
  tableRowIndex,
  clickedTableRow,
  setClickedTableRow,
  currentPage,
}) => {
  return (
    <tr
      key={tableRow.medicalSpecialityId}
      className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
        (clickedTableRow as MedicalSpeciality)?.medicalSpecialityId ===
          tableRow.medicalSpecialityId &&
        "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
      }`}
      onClick={() => setClickedTableRow(tableRow)}
    >
      <td>{tableRowIndex}</td>
      <td className="px-6 py-4 text-xs">{tableRow.medicalSpecialityId}</td>
      <td className="px-6 py-4 text-xs">{tableRow.medicalSpecialityName}</td>
      <td className="h-14 flex items-center justify-center space-x-2">
        <UpdateMedicalSpeciality medicalSpeciality={tableRow} />
        <DeleteMedicalSpecialityOverlay medicalSpeciality={tableRow} />
      </td>
    </tr>
  );
};
