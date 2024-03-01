import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import {
  MedicalProcedure,
  UpdateMedicalProcedureOverlayProps,
} from "../../../types";
import axios from "axios";
import Overlay from "../base/Overlay";
import { Tooltip } from "../../design/Tooltip";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledInput } from "../../design/StyledInput";
import { medicalProceduresAPI } from "../../../utils/dotenv";
import { StyledInputV2 } from "../../design/StyledInputV2";
import { Toaster, toast } from "sonner";

export const UpdateMedicalProcedureOverlay: FC<
  UpdateMedicalProcedureOverlayProps
> = ({ medicalProcedure }) => {
  const [
    isUpdateMedicalProcedureOverlayVisible,
    setIsUpdateMedicalProcedureOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isUpdateMedicalProcedureConfirmationDialogOverlayVisible,
    setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [medicalProcedureToUpdate, setMedicalProcedureToUpdate] =
    useState<MedicalProcedure>({
      medicalProcedureId: "",
      medicalProcedureName: "",
      medicalProcedurePrice: -1,
    });

  const [isMedicalProcedureNameValid, setIsMedicalProcedureNameValid] =
    useState<boolean>(false);
  const [isMedicalProcedurePriceValid, setIsMedicalProcedurePriceValid] =
    useState<boolean>(false);

  useEffect(() => {
    if (isUpdateMedicalProcedureOverlayVisible)
      setMedicalProcedureToUpdate(medicalProcedure);
  }, [medicalProcedure, isUpdateMedicalProcedureOverlayVisible]);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isUpdateMedicalProcedureOverlayVisible === true &&
          isUpdateMedicalProcedureConfirmationDialogOverlayVisible === true
        )
          setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible(false);
        if (
          isUpdateMedicalProcedureOverlayVisible === true &&
          isUpdateMedicalProcedureConfirmationDialogOverlayVisible === false
        )
          setIsUpdateMedicalProcedureOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isUpdateMedicalProcedureOverlayVisible,
    isUpdateMedicalProcedureConfirmationDialogOverlayVisible,
  ]);

  const regex = /^[a-zA-Z \-]*$/;
  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "medicalProcedureName") {
      setIsMedicalProcedureNameValid(regex.test(value));
    } else if (name === "medicalProcedurePrice") {
      setIsMedicalProcedurePriceValid(parseInt(value) > 0);
    }

    setMedicalProcedureToUpdate((prevMedicalProcedureToUpdate) => ({
      ...prevMedicalProcedureToUpdate,
      [name]: value,
    }));
  }

  useEffect(() => {
    setIsMedicalProcedureNameValid(
      regex.test(medicalProcedure.medicalProcedureName)
    );
    setIsMedicalProcedurePriceValid(medicalProcedure.medicalProcedurePrice > 0);
  }, [medicalProcedure]);

  async function onUpdateMedicalProcedure() {
    try {
      const response = await axios.put(
        medicalProceduresAPI,
        {
          medicalProcedureId: medicalProcedure.medicalProcedureId,
          medicalProcedureName: medicalProcedureToUpdate.medicalProcedureName,
          medicalProcedurePrice: medicalProcedureToUpdate.medicalProcedurePrice,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible(false);
        setIsUpdateMedicalProcedureOverlayVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsUpdateMedicalProcedureOverlayVisible(false);
    }
  };

  return (
    <>
      {isUpdateMedicalProcedureOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Update Medical Speciality`}>
          <PiPencil
            onClick={() => setIsUpdateMedicalProcedureOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isUpdateMedicalProcedureOverlayVisible ? "visible" : "invisible"
        }`}
        closeModal={() => setIsUpdateMedicalProcedureOverlayVisible(false)}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-1/4 lg:h-1/2 rounded-xl shadow p-6 bg-white border border-gray-500 transition-all ${
            isUpdateMedicalProcedureOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">
            Update Medical Procedure
          </span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "text-black"
                    : isMedicalProcedureNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "border-black"
                    : isMedicalProcedureNameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "focus:text-pink-500"
                    : isMedicalProcedureNameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "focus:border-pink-500"
                    : isMedicalProcedureNameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "text-black"
                    : isMedicalProcedureNameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalProcedureToUpdate.medicalProcedureName.length === 0
                    ? "text-pink-500"
                    : isMedicalProcedureNameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalProcedureName"
                styledInputValue={medicalProcedureToUpdate.medicalProcedureName}
                onChangeStyledInput={handleStyledInputChange}
                label="Medical Procedure Name"
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "text-black"
                    : isMedicalProcedurePriceValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "border-black"
                    : isMedicalProcedurePriceValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "focus:text-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "focus:border-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "text-black"
                    : isMedicalProcedurePriceValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  medicalProcedureToUpdate.medicalProcedurePrice === -1
                    ? "text-pink-500"
                    : isMedicalProcedurePriceValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="medicalProcedurePrice"
                styledInputValue={medicalProcedureToUpdate.medicalProcedurePrice.toString()}
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
                inputValue={medicalProcedureToUpdate.medicalProcedureName}
              />
              <StyledInput
                label="medicalProcedurePrice"
                name="medicalProcedurePrice"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={medicalProcedureToUpdate.medicalProcedurePrice.toString()}
              />
            </div>
          </div> */}
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible(
                  true
                )
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsUpdateMedicalProcedureOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isUpdateMedicalProcedureConfirmationDialogOverlayVisible
                ? "visible"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                isUpdateMedicalProcedureConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Update"
                type="yes"
                onClick={onUpdateMedicalProcedure}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsUpdateMedicalProcedureConfirmationDialogOverlayVisible(
                    false
                  )
                }
              />
            </div>
          </ConfirmationDialogOverlay>
        </div>
        <Toaster position="top-right" richColors />
      </Overlay>
    </>
  );
};
