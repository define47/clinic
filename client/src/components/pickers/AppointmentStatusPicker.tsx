import { FC, useContext, useEffect, useRef, useState } from "react";
import { AppointmentStatus, AppointmentStatusPickerProps } from "../../types";
import { VscDash } from "react-icons/vsc";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { StyledInputV2 } from "../design/StyledInputV2";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { getItemInUserSelectedLanguageCode } from "../../utils/clientLanguages";

export const AppointmentStatusPicker: FC<AppointmentStatusPickerProps> = ({
  selectedAppointmentStatusName,
  setSelectedAppointmentStatusName,
  selectedAppointmentStatusValue,
  setSelectedAppointmentStatusValue,
  z,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    AppointmentStatus[]
  >([]);
  // const [selectedAppointmentStatusName, setSelectedAppointmentStatusName] =
  //   useState<string>("");
  // const [selectedAppointmentStatusValue, setSelectedAppointmentStatusValue] =
  //   useState<string>("");
  const [isAppointmentStatusVisible, setIsAppointmentStatusVisible] =
    useState<boolean>(false);
  const appointmentStatusPickerRef = useRef<HTMLDivElement | null>(null);
  const [filteredAppointmentStatuses, setFilteredAppointmentStatuses] =
    useState<AppointmentStatus[]>([]);

  useEffect(() => {
    setAppointmentStatuses([
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Scheduled"
        )!,
        appointmentStatusValue: "scheduled",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Rescheduled"
        )!,
        appointmentStatusValue: "rescheduled",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Completed"
        )!,
        appointmentStatusValue: "completed",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "No-Show"
        )!,
        appointmentStatusValue: "no-show",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Pending Approval"
        )!,
        appointmentStatusValue: "pending approval",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Waiting"
        )!,
        appointmentStatusValue: "waiting",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Confirmed By Patient"
        )!,
        appointmentStatusValue: "confirmed by patient",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Canceled By Patient"
        )!,
        appointmentStatusValue: "canceled by patient",
      },
      {
        appointmentStatusName: getItemInUserSelectedLanguageCode(
          authenticatedUserDataState.language.languageCode,
          "appointmentStatuses",
          "Paid"
        )!,
        appointmentStatusValue: "paid",
      },
    ]);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        appointmentStatusPickerRef.current &&
        !appointmentStatusPickerRef.current.contains(event.target as Node)
      ) {
        setIsAppointmentStatusVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAppointmentStatusVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAppointmentStatusVisible]);

  function filterAppointmentStatuses() {
    const filteredAppointmentStatuses = appointmentStatuses.filter(
      (filteredAppointmentStatus: AppointmentStatus) =>
        filteredAppointmentStatus.appointmentStatusName
          .toLowerCase()
          .startsWith(selectedAppointmentStatusName.toLowerCase())
    );

    return filteredAppointmentStatuses;
  }

  useEffect(() => {
    setFilteredAppointmentStatuses(filterAppointmentStatuses());
  }, [selectedAppointmentStatusName]);

  function handleAppointmentStatusClick(appointmentStatus: AppointmentStatus) {
    setSelectedAppointmentStatusName(appointmentStatus.appointmentStatusName);
    setSelectedAppointmentStatusValue(appointmentStatus.appointmentStatusValue);
    setIsAppointmentStatusVisible(false);
  }

  useEffect(() => {
    for (let i = 0; i < filteredAppointmentStatuses.length; i++) {
      if (
        selectedAppointmentStatusName.toLowerCase() !==
        filteredAppointmentStatuses[i].appointmentStatusName.toLowerCase()
      ) {
        setSelectedAppointmentStatusValue("");
      } else if (
        selectedAppointmentStatusName.toLowerCase() ===
        filteredAppointmentStatuses[i].appointmentStatusName.toLowerCase()
      ) {
        setSelectedAppointmentStatusValue(
          filteredAppointmentStatuses[i].appointmentStatusValue
        );
        break;
      }
    }
  }, [filteredAppointmentStatuses, selectedAppointmentStatusName]);

  const foundAppointmentStatus = appointmentStatuses.find(
    (appointmentStatus: AppointmentStatus) =>
      appointmentStatus.appointmentStatusValue ===
      selectedAppointmentStatusValue
  );

  useEffect(() => {
    if (foundAppointmentStatus) {
      setSelectedAppointmentStatusName(
        foundAppointmentStatus.appointmentStatusName
      );
    }
  }, [foundAppointmentStatus, selectedAppointmentStatusValue]);

  useEffect(() => {
    if (selectedAppointmentStatusValue === "") {
      setSelectedAppointmentStatusValue("");
      setSelectedAppointmentStatusName("");
    }
  }, [selectedAppointmentStatusValue]);

  return (
    <div className="w-full flex">
      <div className={`w-full relative ${z}`} ref={appointmentStatusPickerRef}>
        {/* <StyledInput
          label="Appointment Status Picker"
          inputValue={selectedAppointmentStatusName}
          name="appointmentStatusPicker"
          onChangeStyledInput={(event) => {
            setSelectedAppointmentStatusName(event.target.value);
            setIsAppointmentStatusVisible(true);
          }}
          onClickInput={() => {
            setIsAppointmentStatusVisible(!isAppointmentStatusVisible);
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isAppointmentStatusVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsAppointmentStatusVisible(!isAppointmentStatusVisible);
                }}
              />
            </div>
          }
          isPicker={true}
          isPickerVisible={isAppointmentStatusVisible}
        /> */}
        <StyledInputV2
          unfocusedTextColor={
            selectedAppointmentStatusName.length === 0
              ? "text-black"
              : selectedAppointmentStatusValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            selectedAppointmentStatusName.length === 0
              ? "border-black"
              : selectedAppointmentStatusValue.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            selectedAppointmentStatusName.length === 0
              ? "focus:text-pink-500"
              : selectedAppointmentStatusValue.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            selectedAppointmentStatusName.length === 0
              ? "focus:border-pink-500"
              : selectedAppointmentStatusValue.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            selectedAppointmentStatusName.length === 0
              ? "border-pink-500"
              : selectedAppointmentStatusValue.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            selectedAppointmentStatusName.length === 0
              ? "text-black"
              : selectedAppointmentStatusValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            selectedAppointmentStatusName.length === 0
              ? "text-pink-500"
              : selectedAppointmentStatusValue.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
          focusedLabelBackgroundColor="bg-white"
          icon={
            <div
              className={`transition-transform transform ${
                !isAppointmentStatusVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsAppointmentStatusVisible(!isAppointmentStatusVisible);
                }}
              />
            </div>
          }
          onClickIcon={() =>
            setIsAppointmentStatusVisible(!isAppointmentStatusVisible)
          }
          isDisabled={false}
          label={`Appointment Criteria`}
          name={`appointmentCriteria`}
          onChangeStyledInput={(event) => {
            setSelectedAppointmentStatusName(event.target.value);
            setIsAppointmentStatusVisible(true);
          }}
          onClickInput={() => {
            setIsAppointmentStatusVisible(!isAppointmentStatusVisible);
          }}
          styledInputValue={selectedAppointmentStatusName}
          styledInputWidth="w-full"
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isAppointmentStatusVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedAppointmentStatusName === ""
            ? appointmentStatuses.map(
                (appointmentStatus: AppointmentStatus) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={appointmentStatus.appointmentStatusValue}
                    onClick={() =>
                      handleAppointmentStatusClick(appointmentStatus)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <VscDash />
                        <span>{appointmentStatus.appointmentStatusName}</span>
                        &nbsp;
                      </div>
                      {selectedAppointmentStatusName.toLowerCase() ===
                        appointmentStatus.appointmentStatusName.toLowerCase() && (
                        <TiTick />
                      )}
                    </div>
                  </li>
                )
              )
            : filteredAppointmentStatuses.map(
                (filteredAppointmentStatus: AppointmentStatus) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={filteredAppointmentStatus.appointmentStatusValue}
                    onClick={() =>
                      handleAppointmentStatusClick(filteredAppointmentStatus)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <VscDash />
                        <span>
                          {filteredAppointmentStatus.appointmentStatusName}
                        </span>
                      </div>
                      {selectedAppointmentStatusName.toLowerCase() ===
                        filteredAppointmentStatus.appointmentStatusName.toLowerCase() && (
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
