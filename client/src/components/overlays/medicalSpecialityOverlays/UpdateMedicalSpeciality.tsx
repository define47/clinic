import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  MedicalSpeciality,
  UpdateMedicalSpecialityOverlayProps,
} from "../../../types";
import { medicalSpecialitiesPath } from "../../../utils/dotenv";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import Overlay from "../base/Overlay";
import axios from "axios";
import { StyledInput } from "../../design/StyledInput";
import { Tooltip } from "../../design/Tooltip";
import { StyledInputV2 } from "../../design/StyledInputV2";

export const UpdateMedicalSpeciality: FC<
  UpdateMedicalSpecialityOverlayProps
> = ({ medicalSpeciality }) => {
  const [
    isUpdateMedicalSpecialityOverlayVisible,
    setIsUpdateMedicalSpecialityOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isUpdateMedicalSpecialityConfirmationDialogOverlayVisible,
    setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  const [medicalSpecialityToUpdate, setMedicalSpecialityToUpdate] =
    useState<MedicalSpeciality>({ medicalSpecialityName: "" });

  const [isMedicalSpecialityNameValid, setIsMedicalSpecialityNameValid] =
    useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isUpdateMedicalSpecialityOverlayVisible === true &&
          isUpdateMedicalSpecialityConfirmationDialogOverlayVisible === true
        )
          setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible(false);
        if (
          isUpdateMedicalSpecialityOverlayVisible === true &&
          isUpdateMedicalSpecialityConfirmationDialogOverlayVisible === false
        )
          setIsUpdateMedicalSpecialityOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isUpdateMedicalSpecialityOverlayVisible,
    isUpdateMedicalSpecialityConfirmationDialogOverlayVisible,
  ]);

  async function onUpdateMedicalSpeciality() {
    try {
      const response = await axios.put(
        medicalSpecialitiesPath,
        {
          medicalSpecialityId: medicalSpeciality.medicalSpecialityId,
          medicalSpecialityName:
            medicalSpecialityToUpdate.medicalSpecialityName,
        },
        { withCredentials: true }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isUpdateMedicalSpecialityOverlayVisible)
      setMedicalSpecialityToUpdate(medicalSpeciality);
  }, [medicalSpeciality, isUpdateMedicalSpecialityOverlayVisible]);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const regex = /^[a-zA-Z \-]*$/;
    setIsMedicalSpecialityNameValid(regex.test(value));
    setMedicalSpecialityToUpdate((prevMedicalSpecialityToUpdate) => ({
      ...prevMedicalSpecialityToUpdate,
      [name]: value,
    }));
  }

  useEffect(() => {
    setIsMedicalSpecialityNameValid(medicalSpeciality.medicalSpecialityName);
  }, [medicalSpeciality]);

  return (
    <>
      {isUpdateMedicalSpecialityOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Update Medical Speciality`}>
          <PiPencil
            onClick={() => setIsUpdateMedicalSpecialityOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isUpdateMedicalSpecialityOverlayVisible ? "visible" : "invisible"
        }`}
        closeModal={() => setIsUpdateMedicalSpecialityOverlayVisible(false)}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-1/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isUpdateMedicalSpecialityOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">
            Update Medical Speciality
          </span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "text-black"
                    : isMedicalSpecialityNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "border-black"
                    : isMedicalSpecialityNameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "focus:text-pink-500"
                    : isMedicalSpecialityNameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "focus:border-pink-500"
                    : isMedicalSpecialityNameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "text-black"
                    : isMedicalSpecialityNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalSpecialityToUpdate.medicalSpecialityName.length === 0
                    ? "text-pink-500"
                    : isMedicalSpecialityNameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalSpecialityName"
                styledInputValue={
                  medicalSpecialityToUpdate.medicalSpecialityName
                }
                onChangeStyledInput={handleStyledInputChange}
                label="Medical Speciality Name"
              />
            </div>
          </div>

          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible(
                  true
                )
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsUpdateMedicalSpecialityOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isUpdateMedicalSpecialityConfirmationDialogOverlayVisible
                ? "visible"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible(
                false
              )
            }
          >
            <div
              className={`w-96 h-96 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 rounded-xl flex items-center justify-center transition-all ${
                isUpdateMedicalSpecialityConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Update"
                type="yes"
                onClick={onUpdateMedicalSpeciality}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible(
                    false
                  )
                }
              />
            </div>
          </ConfirmationDialogOverlay>
        </div>
      </Overlay>
    </>
  );
};
