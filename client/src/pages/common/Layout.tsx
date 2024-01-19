import { FC, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticatedUserDataContext } from "../../contexts/UserCtx";

export const Layout: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;

  function determineUserLayout() {
    let content = <div></div>;

    if (authenticatedUserDataState.roleNames[0] === "admin")
      content = (
        <div>
          admin layout <Outlet />
        </div>
      );

    return content;
  }

  return (
    // <div>
    //   {/* {JSON.stringify(authenticatedUserDataState)} */}
    //   Layout <Outlet />
    // </div>
    determineUserLayout()
  );
};
