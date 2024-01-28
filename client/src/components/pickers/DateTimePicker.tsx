import { FC, useEffect, useState } from "react";
import { StyledInput } from "../design/StyledInput";
import { FcCalendar } from "react-icons/fc";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
} from "react-icons/ri";

const getStartOfMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month, 1));
};

const getEndOfMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month + 1, 0));
};

export const DateTimePicker: FC = () => {
  const currentDate = new Date();
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isDateTimePickerShown, setIsDateTimePickerShown] =
    useState<boolean>(false);
  const [areYearsShown, setAreYearsShown] = useState<boolean>(false);
  const [areMonthsShown, setAreMonthsShown] = useState<boolean>(false);
  const [emptyCellsBefore, setEmptyCellsBefore] = useState<number[]>([]);
  const [calendar, setCalendar] = useState<number[]>([]);
  const [emptyCellsAfter, setEmptyCellsAfter] = useState<number[]>([]);
  const [sundays, setSundays] = useState<number[]>([]);

  const years = Array.from(
    { length: 200 },
    (_, i) => new Date().getFullYear() - 123 + i
  );

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const monthData = {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthAbbreviations: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  const weekDaysAbbreviations = ["M", "T", "W", "T", "F", "S", "S"];

  useEffect(() => {
    console.log(currentDate.getUTCFullYear(), currentDate.getUTCMonth());

    setSelectedYear(currentDate.getUTCFullYear());
    setSelectedMonth(currentDate.getUTCMonth());
    setSelectedDay(currentDate.getDate());
  }, []);

  function computeEmptyCellsBefore() {
    const firstDayOfCurrentMonth = getStartOfMonth(selectedYear, selectedMonth);
    const lastDayOfPreviousMonth = getEndOfMonth(
      selectedYear,
      selectedMonth - 1
    );

    const nameOfFirstDayOfCurrentMonth =
      firstDayOfCurrentMonth.toLocaleDateString("en-US", { weekday: "long" });

    const emptyCellsBeforeFirstDayOfCurrentMonth = weekDays.indexOf(
      nameOfFirstDayOfCurrentMonth
    );

    const emptyCellsBefore = [];
    for (let i = 0; i < emptyCellsBeforeFirstDayOfCurrentMonth; i++) {
      emptyCellsBefore.push(lastDayOfPreviousMonth.getDate() - i);
    }

    return emptyCellsBefore.reverse();
  }

  function computeCalendar() {
    const firstDayOfCurrentMonth = getStartOfMonth(selectedYear, selectedMonth);
    const lastDayOfCurrentMonth = getEndOfMonth(selectedYear, selectedMonth);

    const calendarArray = [];

    for (
      let i = firstDayOfCurrentMonth.getUTCDate();
      i <= lastDayOfCurrentMonth.getUTCDate();
      i++
    ) {
      calendarArray.push(i);
    }

    return calendarArray;
  }

  function computeEmptyCellsAfter() {
    const emptyCellsAfter = [];
    const calendar = computeCalendar();
    const emptyCellsBefore = computeEmptyCellsBefore();
    for (let i = 0; i < 42 - (calendar.length + emptyCellsBefore.length); i++) {
      emptyCellsAfter.push(i + 1);
    }

    return emptyCellsAfter;
  }

  function computeSundays() {
    const firstDayOfCurrentMonth = getStartOfMonth(selectedYear, selectedMonth);
    const lastDayOfCurrentMonth = getEndOfMonth(selectedYear, selectedMonth);
    const sundays = [];

    for (
      let i = firstDayOfCurrentMonth.getUTCDate();
      i <= lastDayOfCurrentMonth.getUTCDate();
      i++
    ) {
      const date = new Date(selectedYear, selectedMonth, i);

      console.log(date.getDay());

      //   if (date.getDay() == 6) {
      //     saturdays.push(date);
      //   } else if (date.getDay() == 0) {
      //     sundays.push(date.getDate());
      //   }

      if (date.getDay() === 0) sundays.push(date.getDate());
    }

    // console.log(sundays, saturdays);
    return sundays;
  }

  //   function computeSundays() {
  //     const sundays = [];

  //     for (
  //       let i = 0;
  //       i <= new Date(selectedYear, selectedMonth, 0).getDate();
  //       i++
  //     ) {
  //       const date = new Date(selectedYear, selectedMonth, i);

  //       //   if (date.getDay() == 6) {
  //       //     saturdays.push(date);
  //       //   } else if (date.getDay() == 0) {
  //       //     sundays.push(date.getDate());
  //       //   }

  //       if (date.getDay() === 0) sundays.push(date.getDate());
  //     }

  //     // console.log(sundays, saturdays);
  //     return sundays;
  //   }

  //   function computeCalendar() {
  //     const currentDate = new Date();
  //     // console.log(currentDate.toISOString());

  //     const firstDayOfCurrentMonth = getStartOfMonth(selectedYear, selectedMonth);
  //     const lastDayOfCurrentMonth = getEndOfMonth(selectedYear, selectedMonth);
  //     const lastDayOfPreviousMonth = getEndOfMonth(
  //       selectedYear,
  //       selectedMonth - 1
  //     );

  //     // console.log(
  //     //   firstDayOfCurrentMonth.toISOString(),
  //     //   "first day of month:",
  //     //   firstDayOfCurrentMonth.getUTCDate()
  //     // );
  //     // console.log(
  //     //   lastDayOfCurrentMonth.toISOString(),
  //     //   "last day of month:",
  //     //   lastDayOfCurrentMonth.getUTCDate()
  //     // );

  //     const nameOfFirstDayOfCurrentMonth =
  //       firstDayOfCurrentMonth.toLocaleDateString("en-US", { weekday: "long" });

  //     const nameOfLastDayOfCurrentMonth =
  //       lastDayOfCurrentMonth.toLocaleDateString("en-US", { weekday: "long" });

  //     // console.log(nameOfFirstDayOfCurrentMonth);
  //     // console.log(nameOfLastDayOfCurrentMonth);

  //     const calendarArray = [];
  //     const emptyCellsBefore = [];
  //     const emptyCellsAfter = [];

  //     const emptyCellsBeforeFirstDayOfCurrentMonth = weekDays.indexOf(
  //       nameOfFirstDayOfCurrentMonth
  //     );
  //     // console.log(
  //     //   "emptyCellsBeforeFirstDayOfCurrentMonth",
  //     //   emptyCellsBeforeFirstDayOfCurrentMonth
  //     // );

  //     for (let i = 0; i < emptyCellsBeforeFirstDayOfCurrentMonth; i++) {
  //       emptyCellsBefore.push(lastDayOfPreviousMonth.getDate() - i);
  //     }

  //     for (
  //       let i = firstDayOfCurrentMonth.getUTCDate();
  //       i <= lastDayOfCurrentMonth.getUTCDate();
  //       i++
  //     ) {
  //       calendarArray.push(i);
  //     }

  //   for (
  //     let i = 0;
  //     i < 42 - (calendarArray.length + emptyCellsBefore.length);
  //     i++
  //   ) {
  //     emptyCellsAfter.push(i + 1);
  //   }

  //     const final = emptyCellsBefore
  //       .reverse()
  //       .concat(calendarArray)
  //       .concat(emptyCellsAfter);

  //     // console.log("emptyCellsBefore", emptyCellsBefore);
  //     // console.log("calendarArray", calendarArray);
  //     // console.log("emptyCellsAfter", emptyCellsAfter);
  //     // console.log("final", final);

  //     return final;
  //   }

  useEffect(() => {
    setEmptyCellsBefore(computeEmptyCellsBefore());
    setCalendar(computeCalendar());
    setEmptyCellsAfter(computeEmptyCellsAfter());
    setSundays(computeSundays());
    console.log(computeEmptyCellsBefore());
    console.log(computeCalendar());
    console.log(computeEmptyCellsAfter());
    console.log(computeSundays());
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    // setSelectedEntity(`${selectedDay}-${selectedMonth + 1}-${selectedYear}`);
    setSelectedEntity(
      `${selectedYear}-${
        selectedMonth + 1 <= 9 ? "0" + (selectedMonth + 1) : selectedMonth + 1
      }-${selectedDay <= 9 ? "0" + selectedDay : selectedDay}`
    );
  }, [selectedYear, selectedMonth, selectedDay]);

  useEffect(() => {
    // const saturdays = [];
  }, []);

  return (
    <div className="relative">
      <div className="w-72">
        <StyledInput
          label="datetimepicker"
          inputValue={selectedEntity}
          name="name"
          onChangeStyledInput={() => {}}
          disabled={true}
          icon={
            <RiCalendarLine
              onClick={() => {
                setIsDateTimePickerShown(!isDateTimePickerShown);
                setAreMonthsShown(false);
                setAreYearsShown(false);
              }}
            />
          }
        />
      </div>
      {/* {isDateTimePickerShown && ( */}
      <div
        className={`h-52 flex flex-col absolute top-10 bg-white w-72 rounded-xl ${
          isDateTimePickerShown
            ? "opacity-100 duration-700 shadow-2xl shadow-black/40"
            : "opacity-0 duration-700 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-center text-sm pt-2 pb-1 border-b">
          <RiArrowLeftSLine
            className="w-5"
            onClick={() => {
              if (selectedMonth > 0) setSelectedMonth(selectedMonth - 1);
              else {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              }
            }}
          />
          <div className="w-24 flex items-center justify-center">
            <span
              onClick={() => {
                setAreMonthsShown(!areMonthsShown);
                setAreYearsShown(false);
              }}
            >
              {monthData.months[selectedMonth]}
            </span>
            &nbsp;
            <span
              onClick={() => {
                setAreYearsShown(!areYearsShown);
                setAreMonthsShown(false);
              }}
            >
              {selectedYear}
            </span>
          </div>

          <RiArrowRightSLine
            className="w-5"
            onClick={() => {
              if (selectedMonth < 11) setSelectedMonth(selectedMonth + 1);
              else {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              }
            }}
          />
        </div>
        {/* {!areMonthsShown && ( */}

        <div
          className={`transition-opacity w-72 grid grid-cols-7 gap-1 text-xs items-center justify-center p-1 ${
            !areMonthsShown && !areYearsShown
              ? "h-full opacity-100 duration-700"
              : "h-0 opacity-0 duration-700 pointer-events-none"
          }`}
        >
          {!areMonthsShown && !areYearsShown && (
            <>
              {weekDaysAbbreviations.map(
                (
                  weekDayAbbreviation: string,
                  weekDayAbbreviationIndex: number
                ) => (
                  <span
                    key={weekDayAbbreviationIndex}
                    className={`h-5 w-5 flex items-center justify-center text-gray-300 ${
                      weekDayAbbreviationIndex === 6 && "text-red-600"
                    }`}
                  >
                    {weekDayAbbreviation}
                  </span>
                )
              )}
              {emptyCellsBefore.map((day: number, dayIndex: number) => (
                <span
                  key={dayIndex}
                  className="h-5 w-5 flex items-center justify-center text-gray-300 cursor-not-allowed"
                >
                  {day}
                </span>
              ))}
              {calendar.map((day: number, dayIndex: number) => (
                <span
                  key={dayIndex}
                  className={`h-5 w-5 flex items-center justify-center ${
                    sundays.includes(day) && "text-red-600"
                  } ${
                    currentDate.getUTCFullYear() === selectedYear &&
                    currentDate.getUTCMonth() === selectedMonth &&
                    currentDate.getDate() === day &&
                    "underline !text-pink-500"
                  } ${
                    selectedDay === day && "bg-pink-300 rounded-full"
                  } hover:bg-pink-300 hover:rounded-full cursor-pointer`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </span>
              ))}
              {emptyCellsAfter.map((day: number, dayIndex: number) => (
                <span
                  key={dayIndex}
                  className="h-5 w-5 flex items-center justify-center text-gray-300 cursor-not-allowed"
                >
                  {day}
                </span>
              ))}
            </>
          )}
        </div>

        {/* )} */}
        {/* {areMonthsShown && ( */}
        <div
          className={`transition-opacity ${
            areMonthsShown
              ? "h-full opacity-100 duration-700"
              : "h-0 opacity-0 duration-700 pointer-events-none"
          }`}
        >
          {areMonthsShown && (
            <div className="w-72 h-full grid grid-cols-4 text-xs">
              {monthData.months.map((month: string, monthIndex: number) => (
                <span
                  className="flex items-center justify-center hover:bg-pink-300 hover:rounded-full cursor-pointer"
                  onClick={() => {
                    setSelectedMonth(monthIndex);
                    setAreMonthsShown(false);
                  }}
                >
                  {month}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={`transition-opacity ${
            areYearsShown
              ? "h-full opacity-100 duration-700 overflow-y-auto overflow-x-hidden"
              : "h-0 opacity-0 duration-700 pointer-events-none"
          }`}
        >
          {areYearsShown && (
            <div className="w-72 h-full grid grid-cols-3 text-xs">
              {years.map((year: number) => (
                <span
                  className="flex items-center justify-center hover:bg-pink-300 hover:rounded-full cursor-pointer"
                  onClick={() => {
                    setSelectedYear(year);
                    setAreYearsShown(false);
                  }}
                >
                  {year}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* )} */}
      </div>

      {/* )} */}
    </div>
  );
};
