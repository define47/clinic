import { FC, MouseEvent, useState } from "react";
import {
  MedicalRecordPatient,
  ViewMedicalRecordPatientOverlayProps,
} from "../../../types";
import axios from "axios";
import { medicalRecordPatientsAPIPath } from "../../../utils/dotenv";
import { RiEyeFill, RiEyeLine } from "react-icons/ri";
import { Tooltip } from "../../design/Tooltip";
import { useNavigate } from "react-router-dom";

export const ViewMedicalRecordPatientOverlay: FC<
  ViewMedicalRecordPatientOverlayProps
> = ({ appointmentId }) => {
  const navigate = useNavigate();
  const [
    isViewMedicalRecordPatientOverlayVisible,
    setIsViewMedicalRecordPatientOverlayVisible,
  ] = useState<boolean>(false);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsViewMedicalRecordPatientOverlayVisible(false);
    }
  };

  return (
    <>
      {isViewMedicalRecordPatientOverlayVisible ? (
        <RiEyeFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`View Medical Record Patient`}>
          <RiEyeLine
            // onClick={() => setIsViewMedicalRecordPatientOverlayVisible(true)}
            onClick={() => {
              navigate(`/doctors/medical-record-patient/${appointmentId}`);
            }}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
    </>
  );
};
