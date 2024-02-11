import { FC } from "react";
import { CardEntryProps } from "../../../types";

export const CardEntry: FC<CardEntryProps> = ({
  cardEntryType,
  cardEntryTitle,
  cardEntryData,
}) => {
  return (
    <div className="p-3 w-full h-14 flex items-center justify-between border-b text-xs">
      <span className="w-1/2 font-semibold text-center">{cardEntryTitle}</span>
      <div className={`w-56 flex items-center justify-center text-center`}>
        <span
          className={`${
            cardEntryType === "appointmentStatus" &&
            "w-24 rounded-full py-1 px-3"
          } ${
            cardEntryData === "completed"
              ? "bg-green-200 text-green-600 dark:bg-green-600 dark:text-gray-950"
              : cardEntryData === "canceled"
              ? "bg-red-200 text-red-600 dark:bg-red-600 dark:text-gray-950"
              : cardEntryData === "no-show"
              ? "bg-purple-200 text-purple-600 dark:bg-purple-600 dark:text-gray-950"
              : cardEntryData === "rescheduled"
              ? "bg-yellow-200 text-yellow-600 dark:bg-yellow-600 dark:text-gray-950"
              : cardEntryData === "scheduled"
              ? "bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-gray-950"
              : ""
          }`}
        >
          {cardEntryData}
        </span>
      </div>
    </div>
  );
};
