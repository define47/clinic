import { FC, useEffect, useState } from "react";
import { AppointmentSearchCriteria } from "../../types";

export const AppointmentSearchCriterionPicker: FC = () => {
  const [appointmentSearchCriterion, setAppointmentSearchCriterion] = useState<
    AppointmentSearchCriteria[]
  >([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [
    selectedAppointmentCriteriaValue,
    setSelectedAppointmentCriteriaValue,
  ] = useState<string>("");
  const [selectedAppointmentCriteriaName, setSelectedAppointmentCriteriaName] =
    useState<string>("");
  const [
    isAppointmentSearchCriterionPickerVisible,
    setIsAppointmentSearchCriterionPickerVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    setAppointmentSearchCriterion([
      {
        table: "doctor",
        appointmentSearchCriteriaName: "doctor forename",
        appointmentSearchCriteriaValue: "userForename",
      },
      {
        table: "doctor",
        appointmentSearchCriteriaName: "doctor surname",
        appointmentSearchCriteriaValue: "userSurname",
      },
      {
        table: "patient",
        appointmentSearchCriteriaName: "patient forename",
        appointmentSearchCriteriaValue: "userForename",
      },
      {
        table: "patient",
        appointmentSearchCriteriaName: "patient surname",
        appointmentSearchCriteriaValue: "userSurname",
      },
    ]);
  }, []);

  const filteredAppointmentSearchCriterion = appointmentSearchCriterion.filter(
    (appointmentSearchCriteria: AppointmentSearchCriteria) =>
      appointmentSearchCriteria.appointmentSearchCriteriaName
        .toLowerCase()
        .startsWith(selectedAppointmentCriteriaName.toLowerCase())
  );

  function handleAppointmentCriteriaClick(
    appointmentSearchCriteria: AppointmentSearchCriteria
  ) {
    setSelectedTable(appointmentSearchCriteria.table);
    setSelectedAppointmentCriteriaName(
      appointmentSearchCriteria.appointmentSearchCriteriaName
    );
    setSelectedAppointmentCriteriaValue(
      appointmentSearchCriteria.appointmentSearchCriteriaValue
    );
  }

  return <div className="flex"></div>;
};
