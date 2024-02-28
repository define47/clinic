import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../../utils/clientLanguages";
import { OrderByIndicator } from "../OrderByIndicator";

type MedicalSpecialityHeaderProps = {
  orderByIndicator: string;
  setOrderByIndicator: (orderByIndicator: string) => void;
};

export const MedicalSpecialityHeader: FC<MedicalSpecialityHeaderProps> = ({
  orderByIndicator,
  setOrderByIndicator,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;

  return (
    <tr>
      <td>Index</td>
      <td className="px-6 py-4 font-bold w-1/3">Medical Speciality Id</td>
      <td className="px-6 py-4 font-bold w-1/3">
        <div className="flex items-center justify-center">
          {getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "medicalSpecialityTableColumnNames",
            0
          )}
          <OrderByIndicator
            orderByIndicator={orderByIndicator}
            setOrderByIndicator={setOrderByIndicator}
            orderByColumn="medicalSpecialityName"
          />
        </div>
      </td>
      <td className="px-6 py-4 font-bold w-1/3">
        {/* Actions */}
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "medicalSpecialityTableColumnNames",
          1
        )}
      </td>
    </tr>
  );
};
