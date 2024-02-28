import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { OrderByIndicator } from "../OrderByIndicator";

type PatientHeaderProps = {
  orderByIndicator: string;
  setOrderByIndicator: (orderByIndicator: string) => void;
};

export const PatientHeader: FC<PatientHeaderProps> = ({
  orderByIndicator,
  setOrderByIndicator,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  return (
    <tr>
      <td>Index</td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">patientId</div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">CNP</div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* user forename */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            0
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="userForename"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* userSurname */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            1
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="userSurname"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* userEmail */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            2
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="userEmail"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* userPhoneNumber */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            3
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="userPhoneNumber"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        {/* userGender */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "generalUserTableColumnNames",
          4
        )}
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* userDateOfBirth */}

          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            5
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="userDateOfBirth"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        {/* userAddress */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "generalUserTableColumnNames",
          6
        )}
      </td>
      <td className="px-6 py-4 font-bold">userRoleName</td>

      <td className="px-6 py-4 font-bold">
        {/* Actions */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "generalUserTableColumnNames",
          10
        )}
      </td>
    </tr>
  );
};
