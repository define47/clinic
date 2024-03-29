import { FC, useContext, useEffect } from "react";
import { TopBarProps } from "../../types";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useLocation } from "react-router-dom";
import { Notification } from "../Notification";
import { UserProfile } from "../UserProfile/UserProfile";

export const TopBar: FC<TopBarProps> = ({
  isSidebarExtended,
  setIsSidebarExtended,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const { pathname } = useLocation();

  return (
    <div
      // ${
      //   isSidebarExtended
      //     ? "lg:w-[calc(100%-256px)] lg:left-64"
      //     : "lg:w-[calc(100%-40px)] lg:left-20"
      // }
      // fixed left-20 w-[calc(100%-40px)]
      className={`hidden h-14 lg:flex items-center justify-between w-full bg-lightMode-topBarColor dark:bg-darkMode-topBarColor dark:text-darkMode-topBarItemTextColor border-b border-lightMode-borderColor dark:border-darkMode-borderColor px-3 transition-all duration-500`}
    >
      <div className="w-full pl-20">{pathname}</div>
      <div className="w-full flex justify-center">b</div>
      <div className="w-full flex items-center justify-end text-sm">
        <Notification />
        <ThemeSwitcher />
        <UserProfile />
      </div>
    </div>
  );
};
