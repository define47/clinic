import { FC } from "react";

type ConfirmationDialogEntryProps = {
  entryWidth: string;
  entryHeight: string;
  confirmationDialogEntryTitleWidth: string;
  confirmationDialogEntryTitle: string;
  confirmationDialogEntryBodyWidth: string;
  confirmationDialogEntryBody: string;
};
export const StyledEntry: FC<ConfirmationDialogEntryProps> = ({
  entryWidth,
  entryHeight,
  confirmationDialogEntryTitleWidth,
  confirmationDialogEntryTitle,
  confirmationDialogEntryBodyWidth,
  confirmationDialogEntryBody,
}) => {
  return (
    <div
      className={`${entryHeight} ${entryWidth} flex mb-2 border dark:border-darkMode-borderColor text-xs`}
    >
      <div
        className={`${confirmationDialogEntryTitleWidth} h-full border bg-gray-300 dark:bg-darkMode-oddRowTable dark:text-gray-500 dark:border-darkMode-borderColor font-bold p-2 text-xs`}
      >
        <span className="w-full h-full flex justify-center items-center text-center">
          {confirmationDialogEntryTitle}
        </span>
      </div>
      <div
        className={`p-1 h-full ${confirmationDialogEntryBodyWidth} flex ${
          confirmationDialogEntryBody.length <= 40 && "items-center"
        } justify-center text-center ${
          confirmationDialogEntryBody.length > 40 && "overflow-y-scroll"
        } break-all`}
      >
        {confirmationDialogEntryBody}
      </div>
    </div>
  );
};
