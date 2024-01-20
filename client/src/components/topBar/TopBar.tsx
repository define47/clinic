import { FC, useContext, useEffect } from "react";
import { TopBarProps } from "../../types";
import { AuthenticatedUserDataContext } from "../../contexts/UserCtx";

export const TopBar: FC<TopBarProps> = ({
  isSidebarExtended,
  setIsSidebarExtended,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;

  // useEffect(() => {
  //   console.log("topbar", authenticatedUserDataState);
  // }, [authenticatedUserDataState]);

  return (
    <div
      className={`h-14 fixed transition-all ${
        isSidebarExtended
          ? "w-[calc(100%-256px)] right-0"
          : "w-[calc(100%-80px)] right-0"
      } bg-white border-b px-2`}
    >
      <div className="fixed flex-flex-col right-3 text-sm">
        <div>
          {authenticatedUserDataState.userForename}&nbsp;
          {authenticatedUserDataState.userSurname}
        </div>
        <div className="flex items-center justify-center">
          {authenticatedUserDataState.roleNames[0]}
        </div>
      </div>
    </div>
  );
};
