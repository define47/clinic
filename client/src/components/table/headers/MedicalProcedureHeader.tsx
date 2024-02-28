import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { OrderByIndicator } from "../OrderByIndicator";

type MedicalSpecialityHeaderProps = {
  orderByIndicator: string;
  setOrderByIndicator: (orderByIndicator: string) => void;
};

export const MedicalProcedureHeader: FC<MedicalSpecialityHeaderProps> = ({
  orderByIndicator,
  setOrderByIndicator,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;

  return (
    <tr>
      <td>Index</td>
      <td className="px-6 py-4 font-bold">medicalProcedureId</td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* medicalProcedureName */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "medicalProcedureTableColumnNames",
            0
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="medicalProcedureName"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        <div className="flex items-center justify-center">
          {/* medicalProcedurePrice */}
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "medicalProcedureTableColumnNames",
            1
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="medicalProcedurePrice"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold">
        {/* Actions */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "medicalProcedureTableColumnNames",
          2
        )}
      </td>
    </tr>
  );
};
