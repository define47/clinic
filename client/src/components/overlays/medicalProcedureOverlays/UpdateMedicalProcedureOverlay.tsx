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
import { medicalProceduresPath } from "../../../utils/dotenv";

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

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setMedicalProcedureToUpdate((prevMedicalProcedureToUpdate) => ({
      ...prevMedicalProcedureToUpdate,
      [name]: value,
    }));
  }

  async function onUpdateMedicalProcedure() {
    try {
      const response = await axios.put(
        medicalProceduresPath,
        {
          medicalProcedureId: medicalProcedure.medicalProcedureId,
          medicalProcedureName: medicalProcedureToUpdate.medicalProcedureName,
          medicalProcedurePrice: medicalProcedureToUpdate.medicalProcedurePrice,
        },
        { withCredentials: true }
      );

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
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isUpdateMedicalProcedureOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeModal={() => setIsUpdateMedicalProcedureOverlayVisible(false)}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isUpdateMedicalProcedureOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">
            Update Medical Speciality
          </span>
          <div className="w-full flex justify-between">
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
          </div>
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
                ? "visible backdrop-blur-sm"
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
      </Overlay>
    </>
  );
};
