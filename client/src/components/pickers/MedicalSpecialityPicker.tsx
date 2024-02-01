import { FC, useEffect, useRef, useState } from "react";
import { MedicalSpeciality, MedicalSpecialityPickerProps } from "../../types";
import axios from "axios";
import { medicalSpecialitiesPath } from "../../utils/dotenv";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { VscDash } from "react-icons/vsc";

export const MedicalSpecialityPicker: FC<MedicalSpecialityPickerProps> = ({
  label,
  selectedMedicalSpecialityId,
  setSelectedMedicalSpecialityId,
  selectedMedicalSpecialityName,
  setSelectedMedicalSpecialityName,
  selectedPrimaryMedicalSpecialityId,
  selectedSecondaryMedicalSpecialityId,
  selectedTertiaryMedicalSpecialityId,
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
      const response = await axios.get(medicalSpecialitiesPath, {
        params: {
          searchQuery: "",
          limit: 9999999,
          page: 0,
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
    // setUserSearchCriteriaTerm(userSearchCriteria.userSearchCriteriaName);
    setSelectedMedicalSpecialityName(medicalSpeciality.medicalSpecialityName);
    setSelectedMedicalSpecialityId(medicalSpeciality.medicalSpecialityId!);
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
          filteredMedicalSpecialities[i].medicalSpecialityId!
        );
        break;
      }
    }
  }, [selectedMedicalSpecialityName, filterMedicalSpecialities]);

  useEffect(() => {
    console.log(
      "medical speciality picker",
      selectedMedicalSpecialityName,
      selectedMedicalSpecialityId
    );
  }, [selectedMedicalSpecialityName, selectedMedicalSpecialityId]);

  // useEffect(() => {
  //   setSelectedMedicalSpecialityName("anesthesiology");
  // }, []);

  // useEffect(() => {
  //   for (let i = 0; i < medicalSpecialties.length; i++) {
  //     if (
  //       selectedMedicalSpecialityName.toLowerCase() ===
  //       medicalSpecialties[i].medicalSpecialityName.toLowerCase()
  //     ) {
  //       setSelectedMedicalSpecialityId(
  //         medicalSpecialties[i].medicalSpecialityId!
  //       );
  //       break;
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   const foundSpeciality = medicalSpecialities.find(
  //     (medicalSpeciality) =>
  //       medicalSpeciality.medicalSpecialityName.toLowerCase() ===
  //       selectedMedicalSpecialityName.toLowerCase()
  //   );

  //   if (foundSpeciality) {
  //     setSelectedMedicalSpecialityId(foundSpeciality.medicalSpecialityId!);
  //   }
  // }, []);

  return (
    <div className="flex">
      <div
        className={`relative ${
          label.includes("primary")
            ? "z-50"
            : label.includes("secondary")
            ? "z-40"
            : label.includes("tertiary")
            ? "z-30"
            : ""
        }`}
        ref={medicalSpecialityPickerRef}
      >
        <StyledInput
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
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isMedicalSpecialityPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedMedicalSpecialityName === ""
            ? medicalSpecialities.map(
                (medicalSpeciality: MedicalSpeciality) =>
                  selectedPrimaryMedicalSpecialityId !==
                    medicalSpeciality.medicalSpecialityId &&
                  selectedSecondaryMedicalSpecialityId !==
                    medicalSpeciality.medicalSpecialityId &&
                  selectedTertiaryMedicalSpecialityId !==
                    medicalSpeciality.medicalSpecialityId && (
                    <li
                      className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
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
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
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
