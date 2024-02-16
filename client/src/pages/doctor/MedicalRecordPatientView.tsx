import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { medicalRecordPatientsPath } from "../../utils/dotenv";
import { MedicalRecordPatient } from "../../types";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";

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

  const [pageNumber, setPageNumber] = useState<number>(1);
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    //   pageStyle: `
    //   @page {
    //     size: auto;
    //     margin: 0.3in 0.2in 0.3in 0.2in !important;
    //   }
    //   .page-counter {
    //     content: counter(page);
    //     counter-increment: page;
    //     position: absolute;
    //     bottom: 10px;
    //     right: 10px;
    //   }
    // `

    onAfterPrint: () => console.log("print completed"),
  });

  return (
    // <div className="mt-20" ref={componentRef}>
    // {appointmentId}
    // {medicalRecordPatientToView?.symptoms}
    // {medicalRecordPatientToView?.diagnosis}
    // {medicalRecordPatientToView?.conductedTests}
    // {medicalRecordPatientToView?.recommendations}

    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}

    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}
    //   {medicalRecordPatientToView?.symptoms}
    //   {medicalRecordPatientToView?.diagnosis}
    //   {medicalRecordPatientToView?.conductedTests}
    //   {medicalRecordPatientToView?.recommendations}

    //   <div className="page-counter"></div>

    // <button className="text-green-500" onClick={handlePrint}>
    //   Click here to print
    // </button>
    // </div>
    <>
      <button className="text-green-500" onClick={handlePrint}>
        Click here to print
      </button>
      <div className="book" ref={componentRef}>
        <div className="page">
          <div className="subpage">
            Page 1/2 {appointmentId}
            {medicalRecordPatientToView?.symptoms}
            {medicalRecordPatientToView?.diagnosis}
            {medicalRecordPatientToView?.conductedTests}
            {medicalRecordPatientToView?.recommendations}
          </div>
        </div>
        <div className="page">
          <div className="subpage">Page 2/2</div>
        </div>
      </div>
    </>
  );
};
