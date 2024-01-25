import { FC, useEffect, useRef, useState } from "react";
import { MedicalSpeciality } from "../../types";
import axios from "axios";
import { medicalSpecialityPath } from "../../utils/dotenv";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";

export const MedicalSpecialityPicker: FC = () => {
  const [medicalSpecialties, setMedicalSpecialities] = useState<
    MedicalSpeciality[]
  >([]);
  const [selectedMedicalSpecialityId, setSelectedMedicalSpecialityId] =
    useState<string>("");
  const [selectedMedicalSpecialityName, setSelectedMedicalSpecialityName] =
    useState<string>("");
  const [
    isMedicalSpecialityPickerVisible,
    setIsMedicalSpecialityPickerVisible,
  ] = useState<boolean>(false);
  const medicalSpecialityPickerRef = useRef<HTMLDivElement | null>(null);

  async function getMedicalSpecialities() {
    try {
      const response = await axios.get(medicalSpecialityPath, {
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

  const filteredMedicalSpecialities = medicalSpecialties.filter(
    (filteredMedicalSpeciality: MedicalSpeciality) =>
      filteredMedicalSpeciality.medicalSpecialityName
        .toLowerCase()
        .startsWith(selectedMedicalSpecialityName.toLowerCase())
  );

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

  function handleMedicalSpecialityClick(medicalSpeciality: MedicalSpeciality) {
    // setUserSearchCriteriaTerm(userSearchCriteria.userSearchCriteriaName);
    setSelectedMedicalSpecialityName(medicalSpeciality.medicalSpecialityName);
    setSelectedMedicalSpecialityId(medicalSpeciality.medicalSpecialityId!);
    setIsMedicalSpecialityPickerVisible(false);
  }

  useEffect(() => {
    console.log(
      "medical speciality picker",
      selectedMedicalSpecialityName,
      selectedMedicalSpecialityId
    );
  }, [selectedMedicalSpecialityName, selectedMedicalSpecialityId]);

  return (
    <div className="flex">
      <div className="relative z-50" ref={medicalSpecialityPickerRef}>
        <StyledInput
          label={`Medical Speciality`}
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
            // <div>
            //   {isUserSearchCriterionPickerVisible ? (
            //     <RiArrowDownSLine
            //       onClick={(event) => {
            //         event.stopPropagation();
            //         setIsUserSearchCriterionPickerVisible(false);
            //       }}
            //     />
            //   ) : (
            //     <RiArrowUpSLine
            //       onClick={(event) => {
            //         event.stopPropagation();
            //         setIsUserSearchCriterionPickerVisible(true);
            //       }}
            //     />
            //   )}
            // </div>
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
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isMedicalSpecialityPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedMedicalSpecialityName === ""
            ? medicalSpecialties.map((medicalSpeciality: MedicalSpeciality) => (
                <li
                  className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={medicalSpeciality.medicalSpecialityId}
                  onClick={() =>
                    handleMedicalSpecialityClick(medicalSpeciality)
                  }
                >
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <span>-&nbsp;</span>
                      <span>{medicalSpeciality.medicalSpecialityName}</span>
                    </div>
                    {selectedMedicalSpecialityName ===
                      medicalSpeciality.medicalSpecialityName && <TiTick />}
                  </div>
                </li>
              ))
            : filteredMedicalSpecialities.map(
                (filteredMedicalSpeciality: MedicalSpeciality) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={filteredMedicalSpeciality.medicalSpecialityId}
                    onClick={() =>
                      handleMedicalSpecialityClick(filteredMedicalSpeciality)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <span>-&nbsp;</span>
                        <span>
                          {filteredMedicalSpeciality.medicalSpecialityName}
                        </span>
                      </div>
                      {selectedMedicalSpecialityName ===
                        filteredMedicalSpeciality.medicalSpecialityName && (
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
