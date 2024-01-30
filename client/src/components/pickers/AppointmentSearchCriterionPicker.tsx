import { FC, useEffect, useRef, useState } from "react";
import {
  AppointmentSearchCriteria,
  AppointmentSearchCriterionPickerProps,
} from "../../types";
import { RiArrowUpSLine } from "react-icons/ri";
import { StyledInput } from "../design/StyledInput";
import { TiTick } from "react-icons/ti";

export const AppointmentSearchCriterionPicker: FC<
  AppointmentSearchCriterionPickerProps
> = ({
  selectedTable,
  setSelectedTable,
  selectedAppointmentCriteriaValue,
  setSelectedAppointmentCriteriaValue,
  selectedAppointmentCriteriaName,
  setSelectedAppointmentCriteriaName,
}) => {
  const [appointmentSearchCriterion, setAppointmentSearchCriterion] = useState<
    AppointmentSearchCriteria[]
  >([]);
  const [
    filteredAppointmentSearchCriterion,
    setFilteredAppointmentSearchCriterion,
  ] = useState<AppointmentSearchCriteria[]>([]);
  // const [selectedTable, setSelectedTable] = useState<string>("");
  // const [
  //   selectedAppointmentCriteriaValue,
  //   setSelectedAppointmentCriteriaValue,
  // ] = useState<string>("");
  // const [selectedAppointmentCriteriaName, setSelectedAppointmentCriteriaName] =
  //   useState<string>("");
  const [
    isAppointmentSearchCriterionPickerVisible,
    setIsAppointmentSearchCriterionPickerVisible,
  ] = useState<boolean>(false);
  const appointmentSearchCriterionPickerRef = useRef<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        appointmentSearchCriterionPickerRef.current &&
        !appointmentSearchCriterionPickerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsAppointmentSearchCriterionPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        setIsAppointmentSearchCriterionPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAppointmentSearchCriterionPickerVisible]);

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
        table: "doctor",
        appointmentSearchCriteriaName: "doctor forename surname",
        appointmentSearchCriteriaValue: "userForename,userSurname",
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
      {
        table: "patient",
        appointmentSearchCriteriaName: "patient forename surname",
        appointmentSearchCriteriaValue: "userForename,userSurname",
      },
    ]);
  }, []);

  function filterAppointments() {
    const filteredAppointmentSearchCriterion =
      appointmentSearchCriterion.filter(
        (appointmentSearchCriteria: AppointmentSearchCriteria) =>
          appointmentSearchCriteria.appointmentSearchCriteriaName
            .toLowerCase()
            .startsWith(selectedAppointmentCriteriaName.toLowerCase())
      );

    return filteredAppointmentSearchCriterion;
  }

  useEffect(() => {
    setFilteredAppointmentSearchCriterion(filterAppointments());
  }, [selectedAppointmentCriteriaName]);

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
    setIsAppointmentSearchCriterionPickerVisible(false);
  }

  useEffect(() => {
    for (let i = 0; i < filteredAppointmentSearchCriterion.length; i++) {
      if (
        selectedAppointmentCriteriaName.toLowerCase() !==
        filteredAppointmentSearchCriterion[
          i
        ].appointmentSearchCriteriaName.toLowerCase()
      ) {
        setSelectedTable("");
        setSelectedAppointmentCriteriaValue("");
      } else if (
        selectedAppointmentCriteriaName.toLowerCase() ===
        filteredAppointmentSearchCriterion[
          i
        ].appointmentSearchCriteriaName.toLowerCase()
      ) {
        setSelectedTable(filteredAppointmentSearchCriterion[i].table);
        setSelectedAppointmentCriteriaValue(
          filteredAppointmentSearchCriterion[i].appointmentSearchCriteriaValue
        );
        break;
      }
    }

    // if (
    //   selectedAppointmentCriteriaName.toLowerCase() === "doctor userForename"
    // ) {
    //   setSelectedTable("doctor");
    //   setSelectedAppointmentCriteriaValue("userForename");
    // }
  }, [filteredAppointmentSearchCriterion, selectedAppointmentCriteriaName]);

  useEffect(() => {
    console.log(
      "current",
      selectedAppointmentCriteriaName,
      selectedAppointmentCriteriaValue,
      selectedTable
    );
  }, [
    selectedAppointmentCriteriaName,
    selectedAppointmentCriteriaValue,
    selectedTable,
  ]);

  return (
    <div className="flex">
      <div className="relative" ref={appointmentSearchCriterionPickerRef}>
        <StyledInput
          label={`Appointment Criteria`}
          inputValue={selectedAppointmentCriteriaName}
          name="userCriteria"
          onChangeStyledInput={(event) => {
            setSelectedAppointmentCriteriaName(event.target.value);
            setIsAppointmentSearchCriterionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsAppointmentSearchCriterionPickerVisible(
              !isAppointmentSearchCriterionPickerVisible
            );
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isAppointmentSearchCriterionPickerVisible
                  ? "rotate-0"
                  : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsAppointmentSearchCriterionPickerVisible(
                    !isAppointmentSearchCriterionPickerVisible
                  );
                }}
              />
            </div>
          }
          isPicker={true}
          isPickerVisible={isAppointmentSearchCriterionPickerVisible}
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isAppointmentSearchCriterionPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedAppointmentCriteriaName === ""
            ? appointmentSearchCriterion.map(
                (appointmentSearchCriteria: AppointmentSearchCriteria) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={
                      appointmentSearchCriteria.appointmentSearchCriteriaName
                    }
                    onClick={() =>
                      handleAppointmentCriteriaClick(appointmentSearchCriteria)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <span>-</span>
                        <span>
                          {
                            appointmentSearchCriteria.appointmentSearchCriteriaName
                          }
                        </span>
                      </div>
                      {selectedAppointmentCriteriaName.toLowerCase() ===
                        appointmentSearchCriteria.appointmentSearchCriteriaName.toLowerCase() && (
                        <TiTick />
                      )}
                    </div>
                  </li>
                )
              )
            : filteredAppointmentSearchCriterion.map(
                (
                  filteredAppointmentSearchCriteria: AppointmentSearchCriteria
                ) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={
                      filteredAppointmentSearchCriteria.appointmentSearchCriteriaName
                    }
                    onClick={() =>
                      handleAppointmentCriteriaClick(
                        filteredAppointmentSearchCriteria
                      )
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <span>-</span>
                        <span>
                          {
                            filteredAppointmentSearchCriteria.appointmentSearchCriteriaName
                          }
                        </span>
                      </div>
                      {selectedAppointmentCriteriaName.toLowerCase() ===
                        filteredAppointmentSearchCriteria.appointmentSearchCriteriaName.toLowerCase() && (
                        <TiTick />
                      )}
                    </div>
                  </li>
                )
              )}
        </ul>
      </div>
    </div>
  );
};
