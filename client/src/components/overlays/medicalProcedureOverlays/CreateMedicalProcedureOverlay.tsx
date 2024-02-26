import { ChangeEvent, FC, useEffect, useState } from "react";
import { MedicalProcedure } from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledInput } from "../../design/StyledInput";
import axios from "axios";
import { medicalProceduresAPI } from "../../../utils/dotenv";
import { StyledInputV2 } from "../../design/StyledInputV2";

type CreateMedicalProcedureOverlayProps = {
  medicalSpecialityId: string;
  medicalSpecialityName: string;
};

export const CreateMedicalProcedureOverlay: FC<
  CreateMedicalProcedureOverlayProps
> = ({ medicalSpecialityId, medicalSpecialityName }) => {
  const [medicalProcedureToCreate, setMedicalProcedureToCreate] =
    useState<MedicalProcedure>({
      medicalProcedureName: "",
      medicalProcedurePrice: -1,
    });
  const [
    isCreateMedicalProcedureOverlayVisible,
    setIsCreateMedicalProcedureOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isCreateMedicalProcedureConfirmationDialogOverlayVisible,
    setIsCreateMedicalProcedureConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  const [isMedicalProcedureNameValid, setIsMedicalProcedureNameValid] =
    useState<boolean>(false);
  const [isMedicalProcedurePriceValid, setIsMedicalProcedurePriceValid] =
    useState<boolean>(false);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const regex = /^[a-zA-Z \-]*$/;

    if (name === "medicalProcedureName") {
      setIsMedicalProcedureNameValid(regex.test(value));
    } else if (name === "medicalProcedurePrice") {
      setIsMedicalProcedurePriceValid(parseInt(value) > 0);
    }

    setMedicalProcedureToCreate((prevmedicalProcedureToCreate) => ({
      ...prevmedicalProcedureToCreate,
      [name]: value,
    }));
  }

  async function onCreateMedicalProcedure() {
    try {
      const response = await axios.post(
        medicalProceduresAPI,
        {
          medicalSpecialityId: medicalSpecialityId.slice(1),
          medicalProcedureName: medicalProcedureToCreate.medicalProcedureName,
          medicalProcedurePrice: medicalProcedureToCreate.medicalProcedurePrice,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isCreateMedicalProcedureOverlayVisible === true &&
          isCreateMedicalProcedureConfirmationDialogOverlayVisible === true
        )
          setIsCreateMedicalProcedureConfirmationDialogOverlayVisible(false);
        if (
          isCreateMedicalProcedureOverlayVisible === true &&
          isCreateMedicalProcedureConfirmationDialogOverlayVisible === false
        )
          setIsCreateMedicalProcedureOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isCreateMedicalProcedureOverlayVisible,
    isCreateMedicalProcedureConfirmationDialogOverlayVisible,
  ]);

  return (
    <>
      <StyledRippleButton
        label={`Create Procedure in ${medicalSpecialityName}`}
        type="create"
        onClick={() => setIsCreateMedicalProcedureOverlayVisible(true)}
      />
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isCreateMedicalProcedureOverlayVisible ? "visible" : "invisible"
        }`}
        closeModal={() => setIsCreateMedicalProcedureOverlayVisible(false)}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-1/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isCreateMedicalProcedureOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create Procedure</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "text-black"
                    : isMedicalProcedureNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "border-black"
                    : isMedicalProcedureNameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "focus:text-pink-500"
                    : isMedicalProcedureNameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "focus:border-pink-500"
                    : isMedicalProcedureNameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "text-black"
                    : isMedicalProcedureNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalProcedureToCreate.medicalProcedureName.length === 0
                    ? "text-pink-500"
                    : isMedicalProcedureNameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalProcedureName"
                styledInputValue={medicalProcedureToCreate.medicalProcedureName}
                onChangeStyledInput={handleStyledInputChange}
                label="Medical Procedure Name"
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "text-black"
                    : isMedicalProcedurePriceValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "border-black"
                    : isMedicalProcedurePriceValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "focus:text-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "focus:border-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "text-black"
                    : isMedicalProcedurePriceValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalProcedureToCreate.medicalProcedurePrice === -1
                    ? "text-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalProcedurePrice"
                styledInputValue={medicalProcedureToCreate.medicalProcedurePrice.toString()}
                onChangeStyledInput={handleStyledInputChange}
                label="Medical Procedure Price"
              />
            </div>
          </div>
          {/* <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="medicalProcedureName"
                name="medicalProcedureName"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue=""
              />
              <StyledInput
                label="medicalProcedurePrice"
                name="medicalProcedurePrice"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue=""
              />
            </div>
          </div> */}
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsCreateMedicalProcedureConfirmationDialogOverlayVisible(
                  true
                )
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsCreateMedicalProcedureOverlayVisible(false)}
            />
          </div>
          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isCreateMedicalProcedureConfirmationDialogOverlayVisible
                ? "visible"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsCreateMedicalProcedureConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 rounded-xl flex items-center justify-center transition-all ${
                isCreateMedicalProcedureConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Create"
                type="yes"
                onClick={onCreateMedicalProcedure}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsCreateMedicalProcedureConfirmationDialogOverlayVisible(
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
