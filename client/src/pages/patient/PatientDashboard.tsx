import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const PatientDashboard: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  return (
    <div>Patient Dashboard: {JSON.stringify(authenticatedUserDataState)}</div>
  );
};
