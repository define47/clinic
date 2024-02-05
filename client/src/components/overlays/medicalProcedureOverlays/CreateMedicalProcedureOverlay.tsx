import { ChangeEvent, FC, useEffect, useState } from "react";
import { MedicalProcedure } from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledInput } from "../../design/StyledInput";
import axios from "axios";

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

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setMedicalProcedureToCreate((prevMedicalSpecialityToCreate) => ({
      ...prevMedicalSpecialityToCreate,
      [name]: value,
    }));
  }

  async function onCreateMedicalProcedure() {
    try {
      const response = await axios.post(
        "http://192.168.2.16:40587/api/medical-procedures",
        {
          medicalSpecialityId,
          medicalProcedureName: medicalProcedureToCreate.medicalProcedureName,
          medicalProcedurePrice: medicalProcedureToCreate.medicalProcedurePrice,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <StyledRippleButton
        label={`Create Procedure in ${medicalSpecialityName}`}
        type="create"
        onClick={() => setIsCreateMedicalProcedureOverlayVisible(true)}
      />
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isCreateMedicalProcedureOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeModal={() => setIsCreateMedicalProcedureOverlayVisible(false)}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isCreateMedicalProcedureOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create Procedure</span>
          <div className="w-full flex justify-between">
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
          </div>
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
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsCreateMedicalProcedureConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
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
