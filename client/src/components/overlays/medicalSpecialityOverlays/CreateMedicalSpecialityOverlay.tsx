import { ChangeEvent, FC, useEffect, useState } from "react";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { MedicalSpeciality } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import {
  medicalSpecialitiesAPIPath,
  medicalSpecialityAPIPath,
} from "../../../utils/dotenv";
import axios from "axios";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledInputV2 } from "../../design/StyledInputV2";
import { Toaster, toast } from "sonner";

export const CreateMedicalSpecialityOverlay: FC = () => {
  const [medicalSpecialityToCreate, setMedicalSpecialityToCreate] =
    useState<MedicalSpeciality>({ medicalSpecialityName: "" });
  const [
    isCreateMedicalSpecialityOverlayVisible,
    setIsCreateMedicalSpecialityOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isCreateMedicalSpecialityConfirmationDialogOverlayVisible,
    setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  const [isMedicalSpecialityValid, setIsMedicalSpecialityValid] =
    useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isCreateMedicalSpecialityOverlayVisible === true &&
          isCreateMedicalSpecialityConfirmationDialogOverlayVisible === true
        )
          setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(false);
        if (
          isCreateMedicalSpecialityOverlayVisible === true &&
          isCreateMedicalSpecialityConfirmationDialogOverlayVisible === false
        )
          setIsCreateMedicalSpecialityOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isCreateMedicalSpecialityOverlayVisible,
    isCreateMedicalSpecialityConfirmationDialogOverlayVisible,
  ]);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const regex = /^[a-zA-Z \-]*$/;
    setIsMedicalSpecialityValid(regex.test(value));
    setMedicalSpecialityToCreate((prevMedicalSpecialityToCreate) => ({
      ...prevMedicalSpecialityToCreate,
      [name]: value,
    }));
  }

  async function onCreateMedicalSpeciality() {
    try {
      const response = await axios.post(
        medicalSpecialityAPIPath,
        {
          medicalSpecialityName:
            medicalSpecialityToCreate.medicalSpecialityName,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(false);
        setIsCreateMedicalSpecialityOverlayVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <StyledRippleButton
        label={`Create Speciality`}
        type="create"
        onClick={() => setIsCreateMedicalSpecialityOverlayVisible(true)}
      />
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isCreateMedicalSpecialityOverlayVisible ? "visible" : "invisible"
        }`}
        closeModal={() => setIsCreateMedicalSpecialityOverlayVisible(false)}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-1/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isCreateMedicalSpecialityOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create Speciality</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "text-black"
                    : isMedicalSpecialityValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "border-black"
                    : isMedicalSpecialityValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "focus:text-pink-500"
                    : isMedicalSpecialityValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "focus:border-pink-500"
                    : isMedicalSpecialityValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "border-pink-500"
                    : isMedicalSpecialityValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "text-black"
                    : isMedicalSpecialityValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalSpecialityToCreate.medicalSpecialityName.length === 0
                    ? "text-pink-500"
                    : isMedicalSpecialityValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalSpecialityName"
                styledInputValue={
                  medicalSpecialityToCreate.medicalSpecialityName
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
                setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(
                  true
                )
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsCreateMedicalSpecialityOverlayVisible(false)}
            />
            <ConfirmationDialogOverlay
              className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
                isCreateMedicalSpecialityConfirmationDialogOverlayVisible
                  ? "visible"
                  : "invisible"
              }`}
              closeConfirmationDialogModal={() =>
                setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(
                  false
                )
              }
            >
              <div
                className={`w-96 h-96 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 rounded-xl flex items-center justify-center transition-all ${
                  isCreateMedicalSpecialityConfirmationDialogOverlayVisible
                    ? "scale-100 opacity-100 duration-200"
                    : "scale-125 opacity-0 duration-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Are you Sure?</span>
                <StyledRippleButton
                  label="Create"
                  type="yes"
                  onClick={onCreateMedicalSpeciality}
                />
                <StyledRippleButton
                  label="Cancel"
                  type="delete"
                  onClick={() =>
                    setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(
                      false
                    )
                  }
                />
              </div>
            </ConfirmationDialogOverlay>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </Overlay>
    </>
  );
};
