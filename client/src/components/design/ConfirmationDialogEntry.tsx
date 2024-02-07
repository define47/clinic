import { FC } from "react";

type ConfirmationDialogEntryProps = {
  confirmationDialogEntryTitleWidth: string;
  confirmationDialogEntryTitle: string;
  confirmationDialogEntryBodyWidth: string;
  confirmationDialogEntryBody: string;
};
export const ConfirmationDialogEntry: FC<ConfirmationDialogEntryProps> = ({
  confirmationDialogEntryTitleWidth,
  confirmationDialogEntryTitle,
  confirmationDialogEntryBodyWidth,
  confirmationDialogEntryBody,
}) => {
  return (
    <div
      className={`h-10 w-96 flex mb-2 border dark:border-darkMode-borderColor`}
    >
      <div
        className={`${confirmationDialogEntryTitleWidth} h-full border bg-gray-300 dark:bg-darkMode-oddRowTable dark:text-gray-500 dark:border-darkMode-borderColor font-bold p-2 text-xs`}
      >
        <span className="w-full h-full flex justify-center items-center text-center">
          {confirmationDialogEntryTitle}
        </span>
      </div>
      <div
        className={`p-1 ${confirmationDialogEntryBodyWidth} flex ${
          confirmationDialogEntryBody.length <= 20 && "items-center"
        } justify-center text-center ${
          confirmationDialogEntryBody.length > 20 && "overflow-y-scroll text-xs"
        } break-words`}
      >
        {confirmationDialogEntryBody}
      </div>
    </div>
  );
};
