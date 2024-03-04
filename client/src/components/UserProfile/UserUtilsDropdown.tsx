import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiLogoutCircleLine,
  RiMoonClearLine,
  RiSunLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { HiLanguage } from "react-icons/hi2";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { TbLogout2 } from "react-icons/tb";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { logoutUserPath, userPreferencesAPIPath } from "../../utils/dotenv";
import { ThemeSwitcher } from "../ThemeSwitcher";

export const UserUtilsDropdown: FC = () => {
  const navigate = useNavigate();
  const { themeValue, setThemeValue } = useContext(ThemeContext);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState<boolean>(false);
  const [areLanguagesVisible, setAreLanguagesVisible] =
    useState<boolean>(false);
  const [areThemesVisible, setAreThemesVisible] = useState<boolean>(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownVisible(false);
        setAreLanguagesVisible(false);
        setAreThemesVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const onLogout = async () => {
    try {
      const response = await axios.post(
        logoutUserPath,
        {},
        { withCredentials: true }
      );

      navigate("/authenticate");
      localStorage.clear();
      setThemeValue("light");
      // navigate(0);
      // return response;
    } catch (error) {}
  };

  async function switchToLightMode() {
    try {
      setThemeValue("light");
      const response = await axios.put(
        userPreferencesAPIPath,
        {
          languageId: authenticatedUserDataState.language.languageId,
          languageCode: authenticatedUserDataState.language.languageCode,
          languageName: authenticatedUserDataState.language.languageName,
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
        userPreferencesAPIPath,
        {
          languageId: authenticatedUserDataState.language.languageId,
          languageCode: authenticatedUserDataState.language.languageCode,
          languageName: authenticatedUserDataState.language.languageName,
          isDarkModeOn: true,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div ref={profileDropdownRef}>
      <RiArrowDownSLine
        className="text-xl dark:text-darkMode-textColor cursor-pointer text-pink-400 transform hover:!text-pink-500 hover:scale-125"
        onClick={(e) => {
          setIsProfileDropdownVisible(!isProfileDropdownVisible);
          setAreLanguagesVisible(false);
          setAreThemesVisible(false);
          // e.stopPropagation();
        }}
      />
      <div
        className={`w-52 md:w-60 h-72 top-15 right-2 overflow-y-scroll absolute z-20 bg-white dark:bg-darkMode-itemBackgroundColor dark:text-darkMode-textColor rounded-xl border border-gray-300 dark:border-darkMode-borderColor transition-opacity ${
          isProfileDropdownVisible
            ? "opacity-100 duration-700"
            : "opacity-0 duration-700 pointer-events-none"
        } shadow-2xl shadow-black/25`}
      >
        {isProfileDropdownVisible && (
          <div className="w-full pl-1">
            <div
              className="w-full h-12 flex items-center justify-between transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor cursor-pointer"
              onClick={(e) => {
                setAreLanguagesVisible(true);
                // setIsProfileDropdownVisible(false);
                e.stopPropagation();
              }}
            >
              <div className="flex items-center">
                <HiLanguage className="text-xl mr-3 dark:text-darkMode-textColor cursor-pointer transform text-pink-500" />
                Language: {authenticatedUserDataState.language.languageName}
              </div>
              <div className="flex items-center">
                <MdKeyboardArrowRight />
              </div>
            </div>

            <div
              className="w-full h-12 flex items-center justify-between transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor cursor-pointer"
              onClick={(e) => {
                setAreThemesVisible(true);
                e.stopPropagation();
              }}
            >
              <div className="flex items-center">
                {themeValue === "dark" ? (
                  <RiMoonClearLine
                    className="text-xl mr-3 dark:text-darkMode-textColor cursor-pointer transform text-pink-500"
                    onClick={switchToDarkMode}
                  />
                ) : (
                  <RiSunLine
                    className="text-xl mr-3 dark:text-darkMode-textColor cursor-pointer transform text-pink-500"
                    onClick={switchToDarkMode}
                  />
                )}
                {/* <ThemeSwitcher /> */}
                Appearance: {themeValue}
              </div>
              <div className="flex items-center">
                <MdKeyboardArrowRight />
              </div>
            </div>
            <Link
              className={`w-full h-12 flex items-center transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor`}
              to="/login"
              onClick={onLogout}
            >
              <TbLogout2 className="text-pink-500 text-lg mr-3" />
              <span className="text-sm text-gray-900 dark:text-gray-400">
                Logout
              </span>
            </Link>
          </div>
        )}
      </div>
      <div
        className={`w-52 md:w-60 h-72 top-15 right-2 overflow-y-scroll absolute z-20 bg-white dark:bg-darkMode-itemBackgroundColor dark:text-darkMode-textColor rounded-xl border border-gray-300 dark:border-darkMode-borderColor transition-opacity ${
          areLanguagesVisible
            ? "opacity-100 duration-700"
            : "opacity-0 duration-700 pointer-events-none"
        } shadow-2xl shadow-black/25`}
      >
        {areLanguagesVisible && (
          <div className="">
            <div className="w-full flex items-center border-b border-gray-300">
              <RiArrowLeftLine
                className="text-xl dark:text-darkMode-textColor cursor-pointer transform hover:!text-pink-500 hover:scale-125"
                onClick={(e) => {
                  setAreLanguagesVisible(false);
                  setIsProfileDropdownVisible(true);
                  e.stopPropagation();
                }}
              />

              <span className="w-full flex justify-center">
                {
                  "getSelectLanguage(authenticatedUserDataState.languageCode, 0)"
                }
              </span>
            </div>
            <div>
              <div className="w-full flex flex-col items-center justify-center">
                <LanguageSwitcher
                  languageId="197a489f-c736-5974-a13e-7c12db1729b8"
                  languageCode="ro"
                  languageName="Romanian"
                />
                <LanguageSwitcher
                  languageId="5d6dfc06-1478-5ab0-a7ef-778a7e606ee1"
                  languageCode="en-GB"
                  languageName="English"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`w-52 md:w-60 h-72 top-15 right-2 overflow-y-scroll absolute z-20 bg-white dark:bg-darkMode-itemBackgroundColor dark:text-darkMode-textColor rounded-xl border border-gray-300 dark:border-darkMode-borderColor transition-opacity ${
          areThemesVisible
            ? "opacity-100 duration-700"
            : "opacity-0 duration-700 pointer-events-none"
        } shadow-2xl shadow-black/25`}
      >
        {areThemesVisible && (
          <div className="">
            <div className="w-full flex items-center border-b border-gray-300">
              <RiArrowLeftLine
                className="text-xl dark:text-darkMode-textColor cursor-pointer transform hover:!text-pink-500 hover:scale-125"
                onClick={(e) => {
                  setAreThemesVisible(false);
                  setIsProfileDropdownVisible(true);
                  e.stopPropagation();
                }}
              />

              <span className="w-full flex justify-center">theme</span>
            </div>
            <div>
              <div className="w-full flex flex-col items-center justify-center">
                <div
                  className="w-full h-12 flex items-center justify-center transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor cursor-pointer"
                  onClick={switchToLightMode}
                >
                  <div className="w-4 flex justify-start">
                    {themeValue === "light" && (
                      <TiTick className="text-3xl dark:text-darkMode-textColor cursor-pointer transform text-pink-500" />
                    )}
                  </div>
                  <span className="w-full">light</span>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <div
                  className="w-full h-12 flex items-center justify-center transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor cursor-pointer"
                  onClick={switchToDarkMode}
                >
                  <div className="w-4 flex justify-start">
                    {themeValue === "dark" && (
                      <TiTick className="text-3xl dark:text-darkMode-textColor cursor-pointer transform text-pink-500" />
                    )}
                  </div>
                  <span className="w-full">dark</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
