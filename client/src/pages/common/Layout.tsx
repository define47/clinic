import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticatedUserDataContext } from "../../contexts/UserCtx";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/topBar/TopBar";

export const Layout: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  function determineUserLayout() {
    let content = <div></div>;

    if (
      authenticatedUserDataState.roleNames.length === 1 &&
      authenticatedUserDataState.roleNames[0] === "admin"
    )
      content = (
        <div>
          <div className="w-full">
            <TopBar
              isSidebarExtended={isSidebarExpanded}
              setIsSidebarExtended={setIsSidebarExpanded}
            />
          </div>

          <div className="fixed top-0 h-screen z-50">
            <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            />
          </div>

          {/* ${
              isSidebarExpanded
                ? "w-[calc(100%-256px)] left-64"
                : "w-[calc(100%-80px)] left-20"
            } */}

          <div
            className={`fixed h-[calc(100%-56px)] w-[calc(100%-80px)] left-20 top-14 flex justify-center transition-all bg-gray-50`}
          >
            <Outlet />
          </div>
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
