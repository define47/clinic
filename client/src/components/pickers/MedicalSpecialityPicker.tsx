import { FC, useEffect, useRef, useState } from "react";
import { MedicalSpeciality, MedicalSpecialityPickerProps } from "../../types";
import axios from "axios";
import { medicalSpecialitiesAPIPath } from "../../utils/dotenv";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { VscDash } from "react-icons/vsc";
import { StyledInputV2 } from "../design/StyledInputV2";

export const MedicalSpecialityPicker: FC<MedicalSpecialityPickerProps> = ({
  medicalSpecialityRank,
  label,
  selectedMedicalSpecialityId,
  setSelectedMedicalSpecialityId,
  selectedMedicalSpecialityName,
  setSelectedMedicalSpecialityName,
  selectedPrimaryMedicalSpecialityId,
  selectedSecondaryMedicalSpecialityId,
  selectedTertiaryMedicalSpecialityId,
  z,
}) => {
  const [medicalSpecialities, setMedicalSpecialities] = useState<
    MedicalSpeciality[]
  >([]);
  const [filteredMedicalSpecialities, setFilteredMedicalSpecialities] =
    useState<MedicalSpeciality[]>([]);
  // const [selectedMedicalSpecialityId, setSelectedMedicalSpecialityId] =
  //   useState<string>("");
  // const [selectedMedicalSpecialityName, setSelectedMedicalSpecialityName] =
  //   useState<string>("");
  const [
    isMedicalSpecialityPickerVisible,
    setIsMedicalSpecialityPickerVisible,
  ] = useState<boolean>(false);
  const medicalSpecialityPickerRef = useRef<HTMLDivElement | null>(null);

  async function getMedicalSpecialities() {
    try {
      const response = await axios.get(medicalSpecialitiesAPIPath, {
        params: {
          searchQuery: "",
          limit: 9999999,
          page: 0,
          orderBy: "asc:medicalSpecialityName",
        },
        withCredentials: true,
      });

      if (response.data.success)
        setMedicalSpecialities(response.data.payload.tableData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMedicalSpecialities();
  }, []);

  function filterMedicalSpecialities() {
    const filteredMedicalSpecialities = medicalSpecialities.filter(
      (filteredMedicalSpeciality: MedicalSpeciality) =>
        filteredMedicalSpeciality.medicalSpecialityName
          .toLowerCase()
          .startsWith(selectedMedicalSpecialityName.toLowerCase())
    );

    return filteredMedicalSpecialities;
  }

  useEffect(() => {
    setFilteredMedicalSpecialities(filterMedicalSpecialities());
  }, [selectedMedicalSpecialityName]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMedicalSpecialityPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMedicalSpecialityPickerVisible]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        medicalSpecialityPickerRef.current &&
        !medicalSpecialityPickerRef.current.contains(event.target as Node)
      ) {
        setIsMedicalSpecialityPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // const handleOutsideClick = (event: MouseEvent) => {
  //   if (
  //     medicalSpecialityPickerRef.current &&
  //     !medicalSpecialityPickerRef.current.contains(event.target as Node)
  //   ) {
  //     setIsMedicalSpecialityPickerVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     handleOutsideClick(event);
  //   };

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);
  function handleMedicalSpecialityClick(medicalSpeciality: MedicalSpeciality) {
    // setSelectedMedicalSpecialityName(medicalSpeciality.medicalSpecialityName);
    // setSelectedMedicalSpecialityId(medicalSpeciality.medicalSpecialityId!);
    // setIsMedicalSpecialityPickerVisible(false);
    setSelectedMedicalSpecialityName(medicalSpeciality.medicalSpecialityName);
    setSelectedMedicalSpecialityId(
      `${medicalSpecialityRank}:${medicalSpeciality.medicalSpecialityId!}`
    );
    setIsMedicalSpecialityPickerVisible(false);
  }

  useEffect(() => {
    setSelectedMedicalSpecialityId("");

    const foundSpeciality = medicalSpecialities.find(
      (medicalSpeciality) =>
        medicalSpeciality.medicalSpecialityName.toLowerCase() ===
        selectedMedicalSpecialityName.toLowerCase()
    );

    if (foundSpeciality) {
      setSelectedMedicalSpecialityId(foundSpeciality.medicalSpecialityId!);
    }
  }, [selectedMedicalSpecialityName, medicalSpecialities]);

  useEffect(() => {
    for (let i = 0; i < filteredMedicalSpecialities.length; i++) {
      if (
        selectedMedicalSpecialityName.toLowerCase() !==
        filteredMedicalSpecialities[i].medicalSpecialityName.toLowerCase()
      ) {
        setSelectedMedicalSpecialityId("");
      } else if (
        selectedMedicalSpecialityName.toLowerCase() ===
        filteredMedicalSpecialities[i].medicalSpecialityName.toLowerCase()
      ) {
        setSelectedMedicalSpecialityId(
          `${medicalSpecialityRank}:${filteredMedicalSpecialities[i]
            .medicalSpecialityId!}`
          // filteredMedicalSpecialities[i].medicalSpecialityId!
        );
        break;
      }
    }
  }, [selectedMedicalSpecialityName, filterMedicalSpecialities]);

  useEffect(() => {
    const foundSpeciality = medicalSpecialities.find(
      (medicalSpeciality) =>
        medicalSpeciality.medicalSpecialityName.toLowerCase() ===
        selectedMedicalSpecialityName.toLowerCase()
    );

    if (foundSpeciality) {
      setSelectedMedicalSpecialityId(
        `${medicalSpecialityRank}:${foundSpeciality.medicalSpecialityId!}`
      );
      setSelectedMedicalSpecialityName(foundSpeciality.medicalSpecialityName);
    }
  }, [selectedMedicalSpecialityId, selectedMedicalSpecialityName]);

  useEffect(() => {
    if (selectedMedicalSpecialityId === "") {
      setSelectedMedicalSpecialityId("");
      setSelectedMedicalSpecialityName("");
    }
  }, [selectedMedicalSpecialityId]);

  return (
    <div className="w-full flex">
      <div className={`w-full relative ${z}`} ref={medicalSpecialityPickerRef}>
        {/* <StyledInput
          label={label}
          inputValue={selectedMedicalSpecialityName}
          name="medicalSpeciality"
          onChangeStyledInput={(event) => {
            setSelectedMedicalSpecialityName(event.target.value);
            setIsMedicalSpecialityPickerVisible(true);
          }}
          onClickInput={() => {
            setIsMedicalSpecialityPickerVisible(
              !isMedicalSpecialityPickerVisible
            );
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isMedicalSpecialityPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsMedicalSpecialityPickerVisible(
                    !isMedicalSpecialityPickerVisible
                  );
                }}
              />
            </div>
          }
          // <RiFilterLine />
          isPicker={true}
          isPickerVisible={isMedicalSpecialityPickerVisible}
          labelBackgroundColor="bg-white"
        /> */}

        <StyledInputV2
          unfocusedTextColor={
            selectedMedicalSpecialityName.length === 0
              ? "text-black"
              : selectedMedicalSpecialityId.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            selectedMedicalSpecialityName.length === 0
              ? "border-black"
              : selectedMedicalSpecialityId.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            selectedMedicalSpecialityName.length === 0
              ? "focus:text-pink-500"
              : selectedMedicalSpecialityId.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            selectedMedicalSpecialityName.length === 0
              ? "focus:border-pink-500"
              : selectedMedicalSpecialityId.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            selectedMedicalSpecialityName.length === 0
              ? "border-pink-500"
              : selectedMedicalSpecialityId.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            selectedMedicalSpecialityName.length === 0
              ? "text-black"
              : selectedMedicalSpecialityId.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            selectedMedicalSpecialityName.length === 0
              ? "text-pink-500"
              : selectedMedicalSpecialityId.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
          focusedLabelBackgroundColor="bg-white"
          icon={
            <div
              className={`transition-transform transform ${
                !isMedicalSpecialityPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsMedicalSpecialityPickerVisible(
                    !isMedicalSpecialityPickerVisible
                  );
                }}
              />
            </div>
          }
          onClickIcon={() => {}}
          isDisabled={false}
          label={label}
          name={`medicalProcedureCriteria`}
          onChangeStyledInput={(event) => {
            setSelectedMedicalSpecialityName(event.target.value);
            setIsMedicalSpecialityPickerVisible(true);
          }}
          onClickInput={() => {
            setIsMedicalSpecialityPickerVisible(
              !isMedicalSpecialityPickerVisible
            );
          }}
          styledInputValue={selectedMedicalSpecialityName}
          styledInputWidth="w-full"
        />
        <ul
          className={`absolute w-full bg-white dark:bg-darkMode-itemBackgroundColor overflow-y-auto h-40 ${
            isMedicalSpecialityPickerVisible
              ? "opacity-100 duration-500 border border-lightMode-borderColor dark:border-darkMode-borderColor rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedMedicalSpecialityName === ""
            ? medicalSpecialities.map(
                (medicalSpeciality: MedicalSpeciality) =>
                  selectedPrimaryMedicalSpecialityId?.split(":")[1] !==
                    medicalSpeciality.medicalSpecialityId &&
                  selectedSecondaryMedicalSpecialityId?.split(":")[1] !==
                    medicalSpeciality.medicalSpecialityId &&
                  selectedTertiaryMedicalSpecialityId?.split(":")[1] !==
                    medicalSpeciality.medicalSpecialityId && (
                    <li
                      className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable cursor-pointer border-b border-lightMode-borderColor dark:border-darkMode-borderColor"
                      key={medicalSpeciality.medicalSpecialityId}
                      onClick={() =>
                        handleMedicalSpecialityClick(medicalSpeciality)
                      }
                    >
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center">
                          <VscDash />
                          <span>{medicalSpeciality.medicalSpecialityName}</span>
                        </div>
                        {selectedMedicalSpecialityName.toLowerCase() ===
                          medicalSpeciality.medicalSpecialityName.toLowerCase() && (
                          <TiTick />
                        )}
                      </div>
                    </li>
                  )
              )
            : filteredMedicalSpecialities.map(
                (filteredMedicalSpeciality: MedicalSpeciality) => (
                  // selectedPrimaryMedicalSpecialityId !==
                  //   filteredMedicalSpeciality.medicalSpecialityId &&
                  // selectedSecondaryMedicalSpecialityId !==
                  //   filteredMedicalSpeciality.medicalSpecialityId &&
                  // selectedTertiaryMedicalSpecialityId !==
                  //   filteredMedicalSpeciality.medicalSpecialityId &&
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable cursor-pointer border-b border-lightMode-borderColor dark:border-darkMode-borderColor"
                    key={filteredMedicalSpeciality.medicalSpecialityId}
                    onClick={() =>
                      handleMedicalSpecialityClick(filteredMedicalSpeciality)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <VscDash />
                        <span>
                          {filteredMedicalSpeciality.medicalSpecialityName}
                        </span>
                      </div>
                      {selectedMedicalSpecialityName.toLowerCase() ===
                        filteredMedicalSpeciality.medicalSpecialityName.toLocaleLowerCase() && (
                        <TiTick />
                      )}
                      {/* {selectedMedicalSpecialityName}-
                        {filteredMedicalSpeciality.medicalSpecialityName} */}
                      {/* {selectedMedicalSpecialityId} */}
                    </div>
                  </li>
                )
              )}
        </ul>
      </div>
    </div>
  );
};
