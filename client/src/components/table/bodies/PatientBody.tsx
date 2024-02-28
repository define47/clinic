import { FC, useContext } from "react";
import { Patient, PatientBodyProps } from "../../../types";
import { getItemInUserSelectedLanguageCode } from "../../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { capitalizeString } from "../../../utils/utils";
import { UpdateUserOverlay } from "../../overlays/userOverlays/UpdateUserOverlay";
import { DeleteUserOverlay } from "../../overlays/userOverlays/DeleteUserOverlay";

export const PatientBody: FC<PatientBodyProps> = ({
  entity,
  tableRow,
  tableRowIndex,
  clickedTableRow,
  setClickedTableRow,
  currentPage,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  return (
    <tr
      key={tableRow.patientId}
      className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
        (clickedTableRow as Patient)?.patientId === tableRow.patientId &&
        "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
      }`}
      onClick={() => setClickedTableRow(tableRow)}
    >
      <td>{tableRowIndex + 1 + currentPage * 5}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientId}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientCNP}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientForename}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientSurname}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientEmail}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientPhoneNumber}</td>
      <td className="px-6 py-4 text-xs">
        {
          getItemInUserSelectedLanguageCode(
            authenticatedUserDataState.language.languageCode,
            "genders",
            capitalizeString(tableRow.patientGender)!
          )!
        }
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.patientDateOfBirth.split("-").reverse().join("-")}
      </td>
      <td className="px-6 py-4 text-xs">{tableRow.patientAddress}</td>
      <td className="px-6 py-4 text-xs">{tableRow.patientRoleName}</td>
      <td className="h-14 flex items-center justify-center space-x-2">
        {/* <UpdateUserOverlay user={tableRow} roleName={entity} /> */}
        <DeleteUserOverlay user={tableRow} roleName={entity} />
      </td>
    </tr>
  );
};
