import { ChangeEvent, FC, useEffect } from "react";
import { AppointmentPeriodPickerProps } from "../../types";

export const AppointmentPeriodPicker: FC<AppointmentPeriodPickerProps> = ({
  selectedAppointmentPeriodValue,
  setSelectedAppointmentPeriodValue,
}) => {
  // const [selectedAppointmentPeriodValue, setSelectedAppointmentPeriodValue] =
  // useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAppointmentPeriodValue(event.target.value);
  };

  useEffect(() => {
    setSelectedAppointmentPeriodValue("today");
  }, []);

  return (
    <div className="w-full text-start flex items-center justify-center">
      <label>
        <input
          className="mr-1"
          type="radio"
          value="today"
          checked={selectedAppointmentPeriodValue === "today"}
          onChange={handleChange}
        />
        Today
      </label>
      <label>
        <input
          className="mr-1"
          type="radio"
          value="week"
          checked={selectedAppointmentPeriodValue === "week"}
          onChange={handleChange}
        />
        Week
      </label>
      <label>
        <input
          className="mr-1"
          type="radio"
          value="nextWeek"
          checked={selectedAppointmentPeriodValue === "nextWeek"}
          onChange={handleChange}
        />
        Next Week
      </label>
      <label>
        <input
          className="mr-1"
          type="radio"
          value="month"
          checked={selectedAppointmentPeriodValue === "month"}
          onChange={handleChange}
        />
        Month
      </label>
    </div>
  );
};
