import { FC, useContext, useState } from "react";

import { PiSunHorizon } from "react-icons/pi";
import {
  RiMoonClearFill,
  RiMoonClearLine,
  RiSunFill,
  RiSunLine,
} from "react-icons/ri";
import { ThemeContext } from "../contexts/ThemeContext";

export const ThemeSwitcher: FC = () => {
  const { themeValue, setThemeValue } = useContext(ThemeContext);
  const [isCursorOnSun, setIsCursorOnSun] = useState<boolean>(false);
  const [isCursorOnMoon, setIsCursorOnMoon] = useState<boolean>(false);

  function switchToLightMode() {
    setThemeValue("light");
  }

  function switchToDarkMode() {
    setThemeValue("dark");
  }

  return (
    <div>
      {themeValue === "dark" ? (
        isCursorOnMoon ? (
          <RiMoonClearFill
            onMouseOut={() => {
              setIsCursorOnMoon(false);
            }}
            className="text-2xl text-pink-500 hover:scale-125 cursor-pointer"
            onClick={switchToLightMode}
          />
        ) : (
          <RiMoonClearLine
            onMouseOver={() => {
              setIsCursorOnMoon(true);
            }}
            className="text-2xl text-pink-400 cursor-pointer"
            onClick={switchToLightMode}
          />
        )
      ) : isCursorOnSun ? (
        <RiSunFill
          onMouseOut={() => {
            setIsCursorOnSun(false);
          }}
          className="text-2xl text-yellow-500 hover:scale-125 cursor-pointer"
          onClick={switchToDarkMode}
        />
      ) : (
        <RiSunLine
          onMouseOver={() => {
            setIsCursorOnSun(true);
          }}
          className="text-2xl text-yellow-400 cursor-pointer"
          onClick={switchToDarkMode}
        />
      )}
    </div>
  );
};
