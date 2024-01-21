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
      // fixed z-20
      className={`h-14 w-full flex items-center justify-between transition-all !bg-red-200 dark:bg-darkMode-topBarColor border-b px-2`}
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
