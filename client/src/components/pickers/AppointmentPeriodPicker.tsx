import { ChangeEvent, FC, useContext, useEffect } from "react";
import { AppointmentPeriodPickerProps } from "../../types";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../utils/clientLanguages";

export const AppointmentPeriodPicker: FC<AppointmentPeriodPickerProps> = ({
  selectedAppointmentPeriodValue,
  setSelectedAppointmentPeriodValue,
}) => {
  // const [selectedAppointmentPeriodValue, setSelectedAppointmentPeriodValue] =
  // useState<string>("");

  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedAppointmentPeriodValue(event.target.value);
  };

  useEffect(() => {
    setSelectedAppointmentPeriodValue("today");
  }, []);

  return (
    <div className="w-full text-start flex items-center justify-center text-xs space-x-1">
      <label className="flex items-center justify-center">
        <input
          className="mr-1"
          type="radio"
          value="today"
          checked={selectedAppointmentPeriodValue === "today"}
          onChange={handleChange}
        />
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "periodNames",
          0
        )}
      </label>
      <label className="flex items-center justify-center">
        <input
          className="mr-1"
          type="radio"
          value="week"
          checked={selectedAppointmentPeriodValue === "week"}
          onChange={handleChange}
        />
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "periodNames",
          1
        )}
      </label>
      <label className="flex items-center justify-center">
        <input
          className="mr-1"
          type="radio"
          value="nextWeek"
          checked={selectedAppointmentPeriodValue === "nextWeek"}
          onChange={handleChange}
        />
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "periodNames",
          2
        )}
      </label>
      <label className="flex items-center justify-center">
        <input
          className="mr-1"
          type="radio"
          value="month"
          checked={selectedAppointmentPeriodValue === "month"}
          onChange={handleChange}
        />
        {getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "periodNames",
          3
        )}
      </label>
    </div>
  );
};
