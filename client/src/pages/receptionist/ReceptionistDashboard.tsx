import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const ReceptionistDashboard: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  return (
    <div>
      Receptionist Dashboard: {JSON.stringify(authenticatedUserDataState)}
    </div>
  );
};
