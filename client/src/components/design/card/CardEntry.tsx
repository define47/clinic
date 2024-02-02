import { FC } from "react";
import { CardEntryProps } from "../../../types";

export const CardEntry: FC<CardEntryProps> = ({
  cardEntryType,
  cardEntryTitle,
  cardEntryData,
}) => {
  return (
    <div className="p-3 w-full flex items-center justify-between border-b">
      <span className="font-semibold">{cardEntryTitle}</span>
      <span>{cardEntryData}</span>
    </div>
  );
};
