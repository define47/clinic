import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const UserProfile: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex">
        <span>{authenticatedUserDataState.userForename}</span>&nbsp;
        <span>{authenticatedUserDataState.userSurname}</span>
      </div>
      <div className="flex justify-center">
        {authenticatedUserDataState.roleNames[0]}&nbsp;
        {authenticatedUserDataState?.roleNames[1]}
      </div>
      <div>
        {authenticatedUserDataState?.medicalSpecialities?.length >= 1 &&
          authenticatedUserDataState?.medicalSpecialities![0]
            .medicalSpecialityName}
        {authenticatedUserDataState?.medicalSpecialities?.length > 1 &&
          authenticatedUserDataState?.medicalSpecialities[1]
            ?.medicalSpecialityName}
        {authenticatedUserDataState?.medicalSpecialities?.length > 2 &&
          authenticatedUserDataState?.medicalSpecialities[2] &&
          authenticatedUserDataState?.medicalSpecialities[2]
            ?.medicalSpecialityName}
      </div>
    </div>
  );
};
