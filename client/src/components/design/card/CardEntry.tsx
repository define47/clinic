import { FC } from "react";
import { CardEntryProps } from "../../../types";
import { StyledAppointmentStatusName } from "../StyledAppointmentStatusName";

export const CardEntry: FC<CardEntryProps> = ({
  cardEntryType,
  cardEntryTitle,
  cardEntryData,
}) => {
  return (
    <div className="p-3 w-full h-14 flex items-center justify-between border-b border-lightMode-borderColor dark:border-darkMode-borderColor text-xs">
      <span className="w-1/3 font-semibold text-center">{cardEntryTitle}</span>
      <div className={`w-2/3 flex items-center justify-center text-center`}>
        {cardEntryType === "appointmentStatus" ? (
          <div className="w-2/3">
            <StyledAppointmentStatusName
              appointmentStatusName={cardEntryData}
            />
          </div>
        ) : (
          <span>{cardEntryData}</span>
        )}
      </div>
    </div>
  );
};
