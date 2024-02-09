import { FC, MouseEvent, useState } from "react";
import {
  CreateMedicalRecordPatientOverlayProps,
  MedicalRecordPatient,
} from "../../../types";
import { RiFilePaper2Fill, RiFilePaper2Line } from "react-icons/ri";
import { Tooltip } from "../../design/Tooltip";
import Overlay from "../base/Overlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";

export const CreateMedicalRecordPatientOverlay: FC<
  CreateMedicalRecordPatientOverlayProps
> = ({ appointment }) => {
  const [
    isCreateMedicalRecordPatientOverlayVisible,
    setIsCreateMedicalRecordPatientOverlayVisible,
  ] = useState<boolean>(false);
  const [
    isCreateMedicalRecordPatientConfirmationDialogOverlayVisible,
    setIsCreateMedicalRecordPatientConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [medicalRecordPatientToCreate, setMedicalRecordPatientToCreate] =
    useState<MedicalRecordPatient>({
      medicalRecordPatientId: "",
      appointmentId: "",
      symptoms: "",
      conductedTests: "",
      diagnosis: "",
      recommendations: "",
    });

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsCreateMedicalRecordPatientOverlayVisible(false);
    }
  };
  return (
    <>
      {isCreateMedicalRecordPatientOverlayVisible ? (
        <RiFilePaper2Fill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Create Medical Record Patient`}>
          <RiFilePaper2Line
            onClick={() => setIsCreateMedicalRecordPatientOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isCreateMedicalRecordPatientOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        // closeModal={() => setIsUpdateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isCreateMedicalRecordPatientOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsCreateMedicalRecordPatientConfirmationDialogOverlayVisible(
                  true
                )
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() =>
                setIsCreateMedicalRecordPatientOverlayVisible(false)
              }
            />

            <ConfirmationDialogOverlay
              className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
                isCreateMedicalRecordPatientConfirmationDialogOverlayVisible
                  ? "visible backdrop-blur-sm"
                  : "invisible"
              }`}
              closeConfirmationDialogModal={() =>
                setIsCreateMedicalRecordPatientConfirmationDialogOverlayVisible(
                  false
                )
              }
            >
              <div
                className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                  isCreateMedicalRecordPatientConfirmationDialogOverlayVisible
                    ? "scale-100 opacity-100 duration-200"
                    : "scale-125 opacity-0 duration-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <StyledRippleButton
                  label="Update"
                  type="yes"
                  onClick={() => {}}
                />
                <StyledRippleButton
                  label="Cancel"
                  type="delete"
                  onClick={() =>
                    setIsCreateMedicalRecordPatientConfirmationDialogOverlayVisible(
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
