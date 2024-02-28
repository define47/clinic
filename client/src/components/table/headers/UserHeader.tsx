import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { OrderByIndicator } from "../OrderByIndicator";

type UserHeaderProps = {
  entity: string;
  orderByIndicator: string;
  setOrderByIndicator: (orderByIndicator: string) => void;
};

export const UserHeader: FC<UserHeaderProps> = ({
  entity,
  orderByIndicator,
  setOrderByIndicator,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;

  return (
    <tr>
      <td>Index</td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">userId</div>
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
          {/* {orderBy !== "asc:userForename" && (
          <RiArrowUpSFill
            className="text-sm cursor-pointer"
            onClick={() => setOrderBy("asc:userForename")}
          />
        )}
        {orderBy === "asc:userForename" && (
          <RiArrowDownSFill
            className="text-sm cursor-pointer"
            onClick={() => setOrderBy("desc:userForename")}
          />
        )} */}
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
          {/* {orderBy !== "asc:userSurname" && (
          <RiArrowUpSFill
            className="text-sm cursor-pointer"
            onClick={() => setOrderBy("asc:userSurname")}
          />
        )}
        {orderBy === "asc:userSurname" && (
          <RiArrowDownSFill
            className="text-sm cursor-pointer"
            onClick={() => setOrderBy("desc:userSurname")}
          />
        )} */}
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
      {entity === "doctor" && (
        <td className="px-6 py-4 font-bold">
          <div className="flex items-center justify-center">
            {/* Primary Speciality */}
            {getItemByLanguageAndCollection(
              authenticatedUserDataState.language.languageCode,
              "generalUserTableColumnNames",
              7
            )}
            <OrderByIndicator
              orderByIndicator={orderByIndicator}
              setOrderByIndicator={setOrderByIndicator}
              orderByColumn="medicalSpecialityName"
            />
          </div>
        </td>
      )}
      {entity === "doctor" && (
        <td className="px-6 py-4 font-bold">
          {/* Secondary Speciality */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            8
          )}
        </td>
      )}
      {entity === "doctor" && (
        <td className="px-6 py-4 font-bold">
          {/* Tertiary Speciality */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "generalUserTableColumnNames",
            9
          )}
        </td>
      )}
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
