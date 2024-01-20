import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticatedUserDataContext } from "../../contexts/UserCtx";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { TopBar } from "../../components/TopBar/TopBar";

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

          <div className="fixed top-0 h-screen">
            <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            />
          </div>

          <div
            className={`fixed h-[calc(100%-56px)] top-14 transition-all ${
              isSidebarExpanded
                ? "w-[calc(100%-256px)] left-64"
                : "w-[calc(100%-80px)] left-20"
            } bg-gray-50`}
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
