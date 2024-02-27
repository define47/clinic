import axios from "axios";
import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RippleButton from "./design/RippleButton";
import { AuthenticatedUserDataContext } from "../contexts/UserContext";
import { TiTick } from "react-icons/ti";
import { userPreferencesPath } from "../utils/dotenv";

interface LanguageSwitcherProps {
  languageId: string;
  languageCode: string;
  languageName: string;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  languageId,
  languageCode,
  languageName,
}) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  const onUpdateUserLanguage = async () => {
    try {
      // ${process.env.REACT_APP_SERVER_SCHEME}${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_USERS_PATH}
      const response = await axios.put(
        userPreferencesPath,

        {
          languageId,
          languageCode,
          languageName,
          isDarkModeOn: authenticatedUserDataState.isDarkModeOn,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate(0);
      } else {
        // toast.error(response.data.error, {
        //   theme: "dark",
        // });
      }
    } catch (error) {
      //
    }
  };

  return (
    // <div>
    //   <RippleButton
    //     label={`${languageName}`}
    //     type="create"
    //     onClick={onUpdateUserLanguage}
    //   />
    // </div>
    <div
      className="w-full h-12 flex items-center justify-center transition duration-200 ease-in-out hover:bg-pink-200 dark:hover:bg-darkMode-itemHoverSidebarColor cursor-pointer"
      onClick={onUpdateUserLanguage}
    >
      <div className="w-4 flex justify-start">
        {authenticatedUserDataState.language.languageCode === languageCode && (
          <TiTick className="text-3xl dark:text-darkMode-textColor cursor-pointer transform text-pink-500" />
        )}
      </div>
      <span className="w-full">{languageName}</span>
    </div>
  );
};
