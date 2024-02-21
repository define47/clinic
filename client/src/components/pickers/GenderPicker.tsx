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
          unfocusedTextColor={
            selectedGenderName.length === 0
              ? "text-black"
              : selectedGenderValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            selectedGenderName.length === 0
              ? "border-black"
              : selectedGenderValue.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            selectedGenderName.length === 0
              ? "focus:text-pink-500"
              : selectedGenderValue.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            selectedGenderName.length === 0
              ? "focus:border-pink-500"
              : selectedGenderValue.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            selectedGenderName.length === 0
              ? "border-pink-500"
              : selectedGenderValue.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            selectedGenderName.length === 0
              ? "text-black"
              : selectedGenderValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            selectedGenderName.length === 0
              ? "text-pink-500"
              : selectedGenderValue.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
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
