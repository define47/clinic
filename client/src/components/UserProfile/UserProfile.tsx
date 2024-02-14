import { FC, useContext } from "react";
import { UserProfilePicture } from "./UserProfilePicture";
import { UserProfileInfo } from "./UserProfileInfo";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const UserProfile: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  return (
    <div className="flex items-center space-x-2">
      <UserProfilePicture userId={authenticatedUserDataState.userId} />
      <UserProfileInfo />
    </div>
  );
};
