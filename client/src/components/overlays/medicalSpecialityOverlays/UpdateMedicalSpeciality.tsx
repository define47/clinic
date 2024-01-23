import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  MedicalSpeciality,
  UpdateMedicalSpecialityOverlayProps,
} from "../../../types";
import { medicalSpecialityPath } from "../../../utils/dotenv";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import Overlay from "../base/Overlay";
import axios from "axios";
import { StyledInput } from "../../design/StyledInput";

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
        medicalSpecialityPath,
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
    setMedicalSpecialityToUpdate((prevMedicalSpecialityToUpdate) => ({
      ...prevMedicalSpecialityToUpdate,
      [name]: value,
    }));
  }

  return (
    <>
      {isUpdateMedicalSpecialityOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <PiPencil
          onClick={() => setIsUpdateMedicalSpecialityOverlayVisible(true)}
          className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
        />
      )}
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isUpdateMedicalSpecialityOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeModal={() => setIsUpdateMedicalSpecialityOverlayVisible(false)}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isUpdateMedicalSpecialityOverlayVisible
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
                label="medicalSpecialityName"
                name="medicalSpecialityName"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={medicalSpecialityToUpdate.medicalSpecialityName}
                // inputValue=""
              />
            </div>
            <div className="flex flex-col space-y-6"></div>
            <div className="flex flex-col space-y-6"></div>
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
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateMedicalSpecialityConfirmationDialogOverlayVisible(
                false
              )
            }
          >
            <div
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
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
