import { FC } from "react";
import { Link } from "react-router-dom";
import { BottomBarItemProps } from "../../types";

{
  /* <span
          className={`absolute h-full w-full ${
            isActive
              ? "opacity-100 duration-500 border-t-2 border-pink-600 rounded-tl-xl"
              : "opacity-0 duration-500"
          }`}
        ></span> */
}

export const BottomBarItem: FC<BottomBarItemProps> = ({
  to,
  icon,
  title,
  isActive,
}) => {
  return (
    <Link to={to}>
      <li
        className={`h-[4.4rem] w-20 flex flex-col items-center justify-center transition-all ${
          isActive
            ? "-translate-y-1 duration-300"
            : "translate-y-0 duration-500"
        }`}
      >
        <span
          className={`text-xl ${
            isActive &&
            "h-10 w-10 flex items-center justify-center rounded-full text-pink-600 bg-pink-200"
          }`}
        >
          {icon}
        </span>
        <span
          className={`text-xs text-center transition-all ${
            isActive ? "opacity-0 duration-300" : "opacity-100 duration-300"
          }`}
        >
          {title}
        </span>
      </li>
    </Link>
  );
};
