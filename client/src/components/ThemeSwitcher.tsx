import { FC, useContext, useEffect, useState } from "react";

import { PiSunHorizon } from "react-icons/pi";
import {
  RiMoonClearFill,
  RiMoonClearLine,
  RiSunFill,
  RiSunLine,
} from "react-icons/ri";
import { ThemeContext } from "../contexts/ThemeContext";
import { AuthenticatedUserDataContext } from "../contexts/UserContext";
import axios from "axios";
import { userPreferencesPath } from "../utils/dotenv";

export const ThemeSwitcher: FC = () => {
  const { themeValue, setThemeValue } = useContext(ThemeContext);
  const [isCursorOnSun, setIsCursorOnSun] = useState<boolean>(false);
  const [isCursorOnMoon, setIsCursorOnMoon] = useState<boolean>(false);
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  useEffect(() => {
    console.log(authenticatedUserDataState);
    // if (authenticatedUserDataState.isDarkModeOn) {
    // const stringValue = authenticatedUserDataState.isDarkModeOn.toString();
    if (authenticatedUserDataState)
      setThemeValue(authenticatedUserDataState.isDarkModeOn ? "dark" : "light");
    // }
  }, [authenticatedUserDataState]);

  async function switchToLightMode() {
    try {
      setThemeValue("light");
      const response = await axios.put(
        userPreferencesPath,
        {
          languageId: "865d0c39-ebba-54be-9f66-7059c8394c13",
          isDarkModeOn: false,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function switchToDarkMode() {
    try {
      setThemeValue("dark");
      const response = await axios.put(
        userPreferencesPath,
        {
          languageId: "865d0c39-ebba-54be-9f66-7059c8394c13",
          isDarkModeOn: true,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
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
