import { FC, useContext } from "react";
import { User, UserBodyProps } from "../../../types";
import {
  capitalizeString,
  determineSpecialityOrder,
} from "../../../utils/utils";
import { UpdateUserOverlay } from "../../overlays/userOverlays/UpdateUserOverlay";
import { DeleteUserOverlay } from "../../overlays/userOverlays/DeleteUserOverlay";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemInUserSelectedLanguageCode } from "../../../utils/clientLanguages";

export const UserBody: FC<UserBodyProps> = ({
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
      key={tableRow.userId}
      className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
        (clickedTableRow as User)?.userId === tableRow.userId &&
        "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
      }`}
      onClick={() => setClickedTableRow(tableRow)}
    >
      <td>{tableRowIndex + 1 + currentPage * 5}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userId}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userForename}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userSurname}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userEmail}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userPhoneNumber}</td>
      <td className="px-6 py-4 text-xs">
        {
          getItemInUserSelectedLanguageCode(
            authenticatedUserDataState.language.languageCode,
            "genders",
            capitalizeString(tableRow.userGender)!
          )!
        }
      </td>
      <td className="px-6 py-4 text-xs">
        {tableRow.userDateOfBirth.split("-").reverse().join("-")}
      </td>
      <td className="px-6 py-4 text-xs">{tableRow.userAddress}</td>
      <td className="px-6 py-4 text-xs">{tableRow.userRoleName}</td>
      {entity === "doctor" && (
        <td className="px-6 py-4 text-xs">
          {determineSpecialityOrder(tableRow.medicalSpecialities!, "P")?.slice(
            0,
            -3
          )}
        </td>
      )}
      {entity === "doctor" && (
        <td className="px-6 py-4 text-xs">
          {determineSpecialityOrder(tableRow.medicalSpecialities!, "S")?.slice(
            0,
            -3
          )}
        </td>
      )}
      {entity === "doctor" && (
        <td className="px-6 py-4 text-xs">
          {determineSpecialityOrder(tableRow.medicalSpecialities!, "T")?.slice(
            0,
            -3
          )}
        </td>
      )}
      <td className="h-14 flex items-center justify-center space-x-2">
        <UpdateUserOverlay user={tableRow} roleName={entity} />
        <DeleteUserOverlay user={tableRow} roleName={entity} />
      </td>
    </tr>
  );
};
