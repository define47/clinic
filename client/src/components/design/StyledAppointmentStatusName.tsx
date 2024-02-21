import { FC, useContext } from "react";
import { StyledAppointmentStatusProps } from "../../types";
import { getItemInUserSelectedLanguageCode } from "../../utils/clientLanguages";
import { capitalizeEachWord, capitalizeString } from "../../utils/utils";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const StyledAppointmentStatusName: FC<StyledAppointmentStatusProps> = ({
  appointmentStatusName,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  let backgroundColor = "";
  let textColor = "";

  switch (appointmentStatusName) {
    case "completed":
      backgroundColor = "bg-green-200 dark:bg-green-600";
      textColor = "text-green-600 dark:text-gray-950";
      break;
    case "canceled":
      backgroundColor = "bg-red-200 dark:bg-red-600";
      textColor = "text-red-600 dark:text-gray-950";
      break;
    case "no-show":
      backgroundColor = "bg-purple-200 dark:bg-purple-600";
      textColor = "text-purple-600 dark:text-gray-950";
      break;
    case "rescheduled":
      backgroundColor = "bg-yellow-200 dark:bg-yellow-600";
      textColor = "text-yellow-600 dark:text-gray-950";
      break;
    case "scheduled":
      backgroundColor = "bg-blue-200 dark:bg-blue-600";
      textColor = "text-blue-600 dark:text-gray-950";
      break;
    case "pending approval":
      backgroundColor = "bg-orange-200 dark:bg-orange-600";
      textColor = "text-orange-600 dark:text-gray-950";
      break;
    case "waiting":
      backgroundColor = "bg-gray-200 dark:bg-gray-600";
      textColor = "text-gray-600 dark:text-gray-950";
      break;
    case "confirmed by patient":
      backgroundColor = "bg-green-200 dark:bg-green-600";
      textColor = "text-green-600 dark:text-gray-950";
      break;
    case "canceled by patient":
      backgroundColor = "bg-red-200 dark:bg-red-600";
      textColor = "text-red-600 dark:text-gray-950";
      break;
    case "paid":
      backgroundColor = "bg-yellow-200 dark:bg-yellow-600";
      textColor = "text-yellow-600 dark:text-gray-950";
      break;
    default:
      break;
  }

  return (
    <div
      className={`w-full rounded-full py-1 px-4 ${backgroundColor} ${textColor}`}
    >
      {/* {appointmentStatusName} */}
      {
        getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          capitalizeEachWord(appointmentStatusName!)
        )!
      }
    </div>
  );
};
