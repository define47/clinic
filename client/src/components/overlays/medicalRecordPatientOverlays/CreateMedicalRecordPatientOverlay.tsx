import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import {
  CreateMedicalRecordPatientOverlayProps,
  MedicalRecordPatient,
} from "../../../types";
import { RiFilePaper2Fill, RiFilePaper2Line } from "react-icons/ri";
import { Tooltip } from "../../design/Tooltip";
import Overlay from "../base/Overlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { MedicalProcedurePicker } from "../../pickers/MedicalProcedurePicker";
import { StyledTextArea } from "../../design/StyledTextArea";
import axios from "axios";
import { medicalRecordPatientsPath } from "../../../utils/dotenv";

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

  function handleStyledTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setMedicalRecordPatientToCreate((prevMedicalRecordToCreate) => ({
      ...prevMedicalRecordToCreate,
      [name]: value,
    }));
  }

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ medicalRecordPatientToCreate:",
      medicalRecordPatientToCreate
    );
  }, [medicalRecordPatientToCreate]);

  async function onCreateMedicalRecordPatient() {
    try {
      const response = await axios.post(
        medicalRecordPatientsPath,
        {
          appointmentId: appointment.appointment.appointmentId,
          symptoms: medicalRecordPatientToCreate.symptoms,
          diagnosis: medicalRecordPatientToCreate.diagnosis,
          conductedTests: "medicalRecordPatientToCreate.conductedTests",
          recommendations: medicalRecordPatientToCreate.recommendations,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

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
          className={`bg-white border border-gray-500 w-5/6 h-5/6 rounded-xl shadow p-6 transition-all ${
            isCreateMedicalRecordPatientOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">
            Create Medical Record Patient
          </span>
          <div className="w-full lg:flex lg:justify-between">
            <div className="w-full flex flex-col">
              <StyledTextArea
                styledInputWidth="w-11/12"
                label="Symptoms"
                name="symptoms"
                onChangeStyledInput={handleStyledTextAreaChange}
              />

              <StyledTextArea
                styledInputWidth="w-11/12"
                label="Recommendations"
                name="recommendations"
                onChangeStyledInput={handleStyledTextAreaChange}
              />
            </div>
            <div className="w-full flex flex-col">
              <StyledTextArea
                styledInputWidth="w-11/12"
                label="Diagnosis"
                name="diagnosis"
                onChangeStyledInput={handleStyledTextAreaChange}
              />
              <MedicalProcedurePicker />
            </div>
          </div>
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
                  label="Yes"
                  type="yes"
                  onClick={onCreateMedicalRecordPatient}
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
