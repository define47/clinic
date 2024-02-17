import { FC, useEffect, useRef, useState } from "react";
import { Gender, GenderPickerProps } from "../../types";
import { StyledInputV2 } from "../design/StyledInputV2";
import { RiArrowUpSLine } from "react-icons/ri";

export const GenderPicker: FC<GenderPickerProps> = ({
  selectedGenderValue,
  setSelectedGenderValue,
  selectedGenderName,
  setSelectedGenderName,
  z,
}) => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [isGenderPickerVisible, setIsGenderPickerVisible] =
    useState<boolean>(false);
  // const [selectedGenderValue, setSelectedGenderValue] = useState<string>("");
  // const [selectedGenderName, setSelectedGenderName] = useState<string>("");
  const genderPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setGenders([
      { genderValue: "male", genderName: "male" },
      { genderValue: "female", genderName: "female" },
    ]);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        genderPickerRef.current &&
        !genderPickerRef.current.contains(event.target as Node)
      ) {
        setIsGenderPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsGenderPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGenderPickerVisible]);

  function handleGenderClick(gender: Gender) {
    setSelectedGenderValue(gender.genderValue);
    setSelectedGenderName(gender.genderName);
    setIsGenderPickerVisible(false);
  }

  const foundGender = genders.find(
    (gender) => gender.genderValue === selectedGenderValue
  );

  useEffect(() => {
    if (foundGender) {
      setSelectedGenderValue(foundGender.genderValue);
      setSelectedGenderName(foundGender.genderName);
    }
  }, [foundGender, selectedGenderValue, selectedGenderName]);

  return (
    <div className="w-full flex">
      <div className={`w-full relative ${z}`} ref={genderPickerRef}>
        <StyledInputV2
          unfocusedTextColor="text-pink-600"
          unfocusedBorderColor="border-pink-600"
          focusedTextColor="focus:text-pink-600"
          focusedBorderColor="focus:border-pink-600"
          unfocusedLabelColor="text-pink-600"
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor="text-pink-600"
          focusedLabelBackgroundColor="bg-white"
          icon={
            <div
              className={`transition-transform transform ${
                !isGenderPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsGenderPickerVisible(!isGenderPickerVisible);
                }}
              />
            </div>
          }
          onClickIcon={() => {}}
          isDisabled={true}
          label={"Gender"}
          name={"gender"}
          onChangeStyledInput={(event) => {
            setSelectedGenderName(event.target.value);
            setIsGenderPickerVisible(true);
          }}
          onClickInput={() => {
            setIsGenderPickerVisible(!isGenderPickerVisible);
          }}
          styledInputValue={selectedGenderName}
          styledInputWidth="w-full"
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isGenderPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {genders.map((gender: Gender) => (
            <li
              className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
              key={gender.genderValue}
              onClick={() => handleGenderClick(gender)}
            >
              {gender.genderName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
