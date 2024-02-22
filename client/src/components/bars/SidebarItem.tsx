import { FC } from "react";
import { Link } from "react-router-dom";
import { SidebarItemProps } from "../../types";

export const SidebarItem: FC<SidebarItemProps> = ({
  to,
  icon,
  title,
  active,
  isSidebarExpanded,
}) => {
  return (
    <Link to={to}>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
          active
            ? "bg-gradient-to-tr from-lightMode-sidebarItemGradientFrom dark:from-darkMode-sidebarItemGradientFrom to-lightMode-sidebarItemGradientTo  dark:to-darkMode-sidebarItemGradientTo  text-lightMode-sidebarItemIconColor dark:text-darkMode-sidebarItemIconColor text-lightMode-sidebarItemIconColor dark:text-darkMode-sidebarItemIconColor"
            : "hover:bg-lightMode-sidebarItemColorHover dark:hover:bg-darkMode-sidebarItemColorHover text-lightMode-sidebarItemTextColor"
        }`}
      >
        <div
          className={`${isSidebarExpanded ? "w-4" : "w-32"} text-2xl mt-0.5`}
        >
          {icon}
        </div>
        <span
          className={`w-52 ml-3 overflow-hidden transition-all ${
            isSidebarExpanded ? "w-full" : "hidden"
          }`}
        >
          {title}
        </span>
        {active && (
          <div
            className={`absolute right-4 w-2 h-2 rounded bg-lightMode-sidebarBubbleColor dark:bg-darkMode-sidebarBubbleColor ${
              isSidebarExpanded ? "" : "top-2"
            }`}
          />
        )}
        {!isSidebarExpanded && (
          <div className={`absolute left-full rounded-md px-2 py-1 ml-4`}>
            {title}
          </div>
        )}
      </li>
    </Link>
  );
};
