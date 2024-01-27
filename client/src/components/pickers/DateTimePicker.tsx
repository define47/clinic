import { FC, useEffect, useState } from "react";

export const DateTimePicker: FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isDateTimePickerShown, setIsDateTimePickerShown] =
    useState<boolean>(false);
  const [areYearsShown, setAreYearsShown] = useState<boolean>(false);
  const [areMonthsShown, setAreMonthsShown] = useState<boolean>(false);

  useEffect(() => {
    const currentDate = new Date();
    console.log(currentDate.toISOString());

    const currentMonthStart = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        1,
        0,
        0,
        0,
        0
      )
    );
    const currentMonthEnd = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
        999
      )
    );
    console.log(
      currentMonthStart.toISOString(),
      "first day of month:",
      currentMonthStart.getUTCDate()
    );
    console.log();
    console.log(
      currentMonthEnd.toISOString(),
      "last day of month:",
      currentMonthEnd.getUTCDate()
    );

    const nameOfFirstDayOfCurrentMonth = currentMonthStart.toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

    console.log(nameOfFirstDayOfCurrentMonth);

    const calendarArray = [];

    for (
      let i = currentMonthStart.getUTCDate();
      i <= currentMonthEnd.getUTCDate();
      i++
    ) {
      calendarArray.push(i);
    }

    console.log(calendarArray);
  }, []);

  return <div></div>;
};
