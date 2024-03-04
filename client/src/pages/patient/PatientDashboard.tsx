import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { GeneralTable } from "../../components/table/GeneralTable";
import { usersAPIPath } from "../../utils/dotenv";

export const PatientDashboard: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  return (
    <div className="w-full h-full">
      Patient Dashboard: {JSON.stringify(authenticatedUserDataState)}
      <div className="w-full h-full">
        {/* <GeneralTable URL={usersPath} entity={"patient"} /> */}
      </div>
    </div>
  );
};
