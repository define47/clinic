import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { medicalRecordPatientsPath } from "../../utils/dotenv";
import { MedicalRecordPatient } from "../../types";

export const MedicalRecordPatientView: FC = () => {
  const { appointmentId } = useParams();
  const [medicalRecordPatientToView, setMedicalRecordPatientToView] =
    useState<MedicalRecordPatient>({
      medicalRecordPatientId: "",
      appointmentId: "",
      symptoms: "",
      conductedTests: "",
      diagnosis: "",
      recommendations: "",
    });

  async function onViewMedicalRecordPatient() {
    try {
      console.log(medicalRecordPatientsPath);

      const response = await axios.get(medicalRecordPatientsPath, {
        params: {
          appointmentId,
        },
        withCredentials: true,
      });

      console.log(response.data);

      if (response.data.success)
        setMedicalRecordPatientToView(response.data.payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    onViewMedicalRecordPatient();
  }, [appointmentId]);

  return (
    <div>
      {appointmentId} {medicalRecordPatientToView?.diagnosis}
    </div>
  );
};
