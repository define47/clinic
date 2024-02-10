import React, { useState, useEffect } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface WeekPickerProps {
  initialDate?: Date;
  setDateWeekStart: (dateWeekStart: string) => void;
  setDashboardWeekEnd: (dateWeekEnd: string) => void;
}

const WeekPicker: React.FC<WeekPickerProps> = ({
  initialDate = new Date(),
  setDateWeekStart,
  setDashboardWeekEnd,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(initialDate);

  const goToPreviousWeek = () => {
    const previousWeek = new Date(currentWeekStart);
    previousWeek.setDate(previousWeek.getDate() - 7);
    setCurrentWeekStart(previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };

  const formatWeekRange = (startDate: Date, endDate: Date): string => {
    const startMonth = startDate.toLocaleString("default", { month: "short" });
    const endMonth = endDate.toLocaleString("default", { month: "short" });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  };

  const getWeekRange = (date: Date): [Date, Date] => {
    const start = new Date(date);
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  };

  useEffect(() => {
    const [startOfWeek, endOfWeek] = getWeekRange(currentWeekStart);
    setDateWeekStart(startOfWeek.toISOString().split("T")[0]);
    setDashboardWeekEnd(endOfWeek.toISOString().split("T")[0]);
  }, [currentWeekStart, setDateWeekStart, setDashboardWeekEnd]);

  return (
    <div className="flex items-center justify-center">
      <span
        className="text-2xl dark:text-darkMode-textColor cursor-pointer transform hover:!text-pink-500 hover:scale-125"
        onClick={goToPreviousWeek}
      >
        <RiArrowLeftSLine />
      </span>
      <span className="w-56 flex items-center justify-center dark:text-darkMode-textColor">
        {formatWeekRange(
          getWeekRange(currentWeekStart)[0],
          getWeekRange(currentWeekStart)[1]
        )}
      </span>
      <span
        className="text-2xl dark:text-darkMode-textColor cursor-pointer transform hover:!text-pink-500 hover:scale-125"
        onClick={goToNextWeek}
      >
        <RiArrowRightSLine />
      </span>
    </div>
  );
};

export default WeekPicker;
