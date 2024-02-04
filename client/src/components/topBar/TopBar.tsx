import { FC, useContext, useEffect } from "react";
import { TopBarProps } from "../../types";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useLocation } from "react-router-dom";

export const TopBar: FC<TopBarProps> = ({
  isSidebarExtended,
  setIsSidebarExtended,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const { pathname } = useLocation();
  // useEffect(() => {
  //   console.log("topbar", authenticatedUserDataState);
  // }, [authenticatedUserDataState]);

  return (
    <div
      // ${
      //   isSidebarExtended
      //     ? "lg:w-[calc(100%-256px)] lg:left-64"
      //     : "lg:w-[calc(100%-40px)] lg:left-20"
      // }
      className={`h-14 fixed flex items-center justify-between left-20  w-[calc(100%-40px)] transition-all 
       
       bg-lightMode-topBarColor dark:bg-darkMode-topBarColor border-b px-2`}
    >
      <div className="w-full">{pathname}</div>
      <div className="w-full flex justify-center">b</div>
      <div className="w-full flex items-center justify-end text-sm">
        <ThemeSwitcher />
        <div className="w-52 flex flex-col bg-gray-100">
          <div className="flex">
            <span>{authenticatedUserDataState.userForename}</span>&nbsp;
            <span>{authenticatedUserDataState.userSurname}</span>
          </div>
          <div className="flex justify-center">
            {authenticatedUserDataState.roleNames[0]}
          </div>
        </div>
      </div>
    </div>
  );
};
