import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { AppointmentHeaderProps } from "../../../types";

export const AppointmentHeader: FC<AppointmentHeaderProps> = ({
  orderByIndicator,
  setOrderByIndicator,
  isPrinting,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  return (
    <tr>
      <td>Index</td>
      <td className="px-6 py-4 font-bold">appointmentId</td>
      <td className="px-6 py-4 font-bold">
        {/* doctor */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          0
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        {/* patient */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          1
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        {/* appointmentReason */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          2
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        {/* appointmentDateTime */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          3
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        {/* appointmentStatus */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          4
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        {/* appointmentCancellationReason */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "appointmentTableColumnNames",
          5
        )}
      </td>

      {isPrinting && (
        <td className="px-6 py-4 font-bold">
          {/* Actions */}
          Comments
        </td>
      )}

      {!isPrinting && (
        <td className="px-6 py-4 font-bold">
          {/* Actions */}
          Price
        </td>
      )}
      {!isPrinting && (
        <td className="px-6 py-4 font-bold">
          {/* Actions */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "appointmentTableColumnNames",
            6
          )}
        </td>
      )}
    </tr>
  );
};
