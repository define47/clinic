import { FC, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/topBar/TopBar";

export const Layout: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  function determineUserLayout() {
    let content = <div></div>;

    if (
      authenticatedUserDataState.roleNames.length === 1 &&
      authenticatedUserDataState.roleNames[0] === "admin"
    )
      content = (
        <div className="select-none w-screen h-screen flex">
          <div className="fixed z-10 h-full">
            <Sidebar
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            />
          </div>

          <div className="w-full flex flex-col h-full flex-wrap">
            <div className="w-full">
              <TopBar
                isSidebarExtended={isSidebarExpanded}
                setIsSidebarExtended={setIsSidebarExpanded}
              />
            </div>
            <div
              className={`fixed md:static h-[calc(100%-56px)] w-[calc(100%-80px) left-20 top-14 flex justify-center transition-all bg-red-300 dark:bg-darkMode-backgroundColor`}
            >
              <Outlet />
            </div>
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
