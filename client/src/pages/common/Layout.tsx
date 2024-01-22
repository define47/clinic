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
          <div className="lg:fixed h-full hidden lg:block z-10">
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
              // md:static
              // left-20 top-14
              className={`lg:fixed lg:left-20 lg:top-14 lg:z-0  lg:h-[calc(100%-56px)] w-screen lg:w-[calc(100%-80px)] flex justify-center transition-all bg-red-300 dark:bg-darkMode-backgroundColor`}
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
