import { ChangeEvent, FC, useEffect, useState } from "react";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { MedicalSpeciality } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import { medicalSpecialityPath } from "../../../utils/dotenv";
import axios from "axios";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";

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
    setMedicalSpecialityToCreate((prevMedicalSpecialityToCreate) => ({
      ...prevMedicalSpecialityToCreate,
      [name]: value,
    }));
  }

  async function onCreateMedicalSpeciality() {
    try {
      const response = await axios.post(
        medicalSpecialityPath,
        {
          medicalSpecialityName:
            medicalSpecialityToCreate.medicalSpecialityName,
        },
        { withCredentials: true }
      );

      console.log(response);
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
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isCreateMedicalSpecialityOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeModal={() => setIsCreateMedicalSpecialityOverlayVisible(false)}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isCreateMedicalSpecialityOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create Speciality</span>
          <div>
            <StyledInput
              label="medicalSpecialityName"
              name="medicalSpecialityName"
              onChangeStyledInput={handleStyledInputChange}
              labelBackgroundColor="bg-white"
            />
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
                  ? "visible backdrop-blur-sm"
                  : "invisible"
              }`}
              closeConfirmationDialogModal={() =>
                setIsCreateMedicalSpecialityConfirmationDialogOverlayVisible(
                  false
                )
              }
            >
              <div
                className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
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
      </Overlay>
    </>
  );
};
