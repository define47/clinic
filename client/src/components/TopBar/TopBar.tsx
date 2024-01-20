import { FC } from "react";
import { TopBarProps } from "../../types";

export const TopBar: FC<TopBarProps> = ({
  isSidebarExtended,
  setIsSidebarExtended,
}) => {
  return (
    <div
      className={`h-14 fixed transition-all ${
        isSidebarExtended
          ? "w-[calc(100%-256px)] right-0"
          : "w-[calc(100%-80px)] right-0"
      } bg-white`}
    >
      Topbar
    </div>
  );
};
