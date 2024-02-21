import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  AppointmentSearchCriteria,
  AppointmentSearchCriterionPickerProps,
} from "../../types";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { VscDash } from "react-icons/vsc";
import { StyledInputV2 } from "../design/StyledInputV2";
import { getItemByLanguageAndCollection } from "../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

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
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
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
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          0
        ),
        appointmentSearchCriteriaValue: "userForename",
      },
      {
        table: "doctor",
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          1
        ),
        appointmentSearchCriteriaValue: "userSurname",
      },
      {
        table: "doctor",
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          2
        ),
        appointmentSearchCriteriaValue: "userForename,userSurname",
      },
      {
        table: "patient",
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          3
        ),
        appointmentSearchCriteriaValue: "userForename",
      },
      {
        table: "patient",
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          4
        ),
        appointmentSearchCriteriaValue: "userSurname",
      },
      {
        table: "patient",
        appointmentSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionAppointment",
          5
        ),
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
    const foundAppointmentSearchCriteria = appointmentSearchCriterion.find(
      (appointmentSearchCriteria) =>
        appointmentSearchCriteria.appointmentSearchCriteriaName.toLowerCase() ===
        selectedAppointmentCriteriaName.toLowerCase()
    );

    if (foundAppointmentSearchCriteria) {
      setSelectedAppointmentCriteriaValue(
        foundAppointmentSearchCriteria.appointmentSearchCriteriaValue
      );
      setSelectedAppointmentCriteriaName(
        foundAppointmentSearchCriteria.appointmentSearchCriteriaName
      );
    }
  }, [selectedAppointmentCriteriaName, selectedAppointmentCriteriaValue]);

  return (
    <div className="w-full flex">
      <div
        className="w-full relative z-50"
        ref={appointmentSearchCriterionPickerRef}
      >
        {/* <StyledInput
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
        /> */}
        <StyledInputV2
          unfocusedTextColor={
            selectedAppointmentCriteriaName.length === 0
              ? "text-black"
              : selectedAppointmentCriteriaValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            selectedAppointmentCriteriaName.length === 0
              ? "border-black"
              : selectedAppointmentCriteriaValue.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            selectedAppointmentCriteriaName.length === 0
              ? "focus:text-pink-500"
              : selectedAppointmentCriteriaValue.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            selectedAppointmentCriteriaName.length === 0
              ? "focus:border-pink-500"
              : selectedAppointmentCriteriaValue.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            selectedAppointmentCriteriaName.length === 0
              ? "border-pink-500"
              : selectedAppointmentCriteriaValue.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            selectedAppointmentCriteriaName.length === 0
              ? "text-black"
              : selectedAppointmentCriteriaValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            selectedAppointmentCriteriaName.length === 0
              ? "text-pink-500"
              : selectedAppointmentCriteriaValue.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
          focusedLabelBackgroundColor="bg-white"
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
          onClickIcon={() =>
            setIsAppointmentSearchCriterionPickerVisible(
              !isAppointmentSearchCriterionPickerVisible
            )
          }
          isDisabled={false}
          label={getItemByLanguageAndCollection(
            authenticatedUserDataState.language.languageCode,
            "searchCriterion",
            0
          )}
          name={`appointmentCriteria`}
          onChangeStyledInput={(event) => {
            setSelectedAppointmentCriteriaName(event.target.value);
            setIsAppointmentSearchCriterionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsAppointmentSearchCriterionPickerVisible(
              !isAppointmentSearchCriterionPickerVisible
            );
          }}
          styledInputValue={selectedAppointmentCriteriaName}
          styledInputWidth="w-full"
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
                      <div className="flex items-center">
                        <VscDash />
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
                      <div className="flex items-center">
                        <VscDash />
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
