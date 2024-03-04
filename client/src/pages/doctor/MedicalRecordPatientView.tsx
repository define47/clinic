import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  appointmentsAPIPath,
  medicalRecordPatientAPIPath,
  medicalRecordsPatientsAPIPath,
} from "../../utils/dotenv";
import { AppointmentTableData, MedicalRecordPatient } from "../../types";
import { useReactToPrint } from "react-to-print";
import { StyledEntry } from "../../components/design/StyledEntry";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import IatropolisLogo from "../../assets/logo-iatropolis.png";

export const MedicalRecordPatientView: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<AppointmentTableData>({
    appointment: {
      appointmentId: "",
      appointmentDoctorId: "",
      appointmentPatientId: "",
      appointmentDateTime: "",
      appointmentReason: "",
      appointmentStatus: "",
      appointmentCancellationReason: "",
    },

    doctor: {
      doctorId: "",
      doctorForename: "",
      doctorSurname: "",
    },
    patient: {
      patientId: "",
      patientEmail: "",
      patientForename: "",
      patientSurname: "",
    },
  });
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
      console.log(medicalRecordsPatientsAPIPath);

      const response = await axios.get(medicalRecordPatientAPIPath, {
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

  async function onGetAppointment() {
    try {
      console.log(medicalRecordsPatientsAPIPath);

      const response = await axios.get(appointmentsAPIPath, {
        params: {
          message: "appointment",
          appointmentId,
        },
        withCredentials: true,
      });

      console.log("app", response.data);

      if (response.data.success) setAppointment(response.data.payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    onViewMedicalRecordPatient();
    onGetAppointment();
  }, [appointmentId]);

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
    <>
      <button className="text-emerald-400" onClick={handlePrint}>
        Print
      </button>
      <div className="w-full h-screen flex items-center justify-center mt-7 mb-20">
        <div
          className="page p-4 w-full h-full flex flex-col rounded-xl"
          ref={componentRef}
        >
          <img
            src={IatropolisLogo}
            alt="Iatropolis, Botosani"
            className="object-contain h-8 w-44"
          />
          <span className="w-full flex justify-center text-xl mb-6">
            Medical Record Patient
          </span>
          <div className="w-full flex">
            <div className="w-full flex flex-col items-center">
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="Patient Name"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`${appointment.patient.patientForename} ${appointment.patient.patientSurname}`}
              />
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="Appointment Date Time"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`${appointment.appointment.appointmentDateTime
                  ?.split("T")[0]
                  ?.split("-")
                  ?.reverse()
                  ?.join("-")} ${appointment.appointment.appointmentDateTime
                  ?.split("T")[1]
                  ?.substring(0, 5)}`}
              />
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="MRN"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`${medicalRecordPatientToView.medicalRecordPatientId}`}
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="Center"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`Iatropolis, Botosani`}
              />
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="Medic"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`${authenticatedUserDataState.userForename} ${authenticatedUserDataState.userSurname}`}
              />
              <StyledEntry
                entryWidth="w-11/12"
                entryHeight="h-8"
                confirmationDialogEntryTitleWidth="w-1/3"
                confirmationDialogEntryTitle="Speciality"
                confirmationDialogEntryBodyWidth="w-4/6"
                confirmationDialogEntryBody={`${
                  authenticatedUserDataState?.medicalSpecialities?.[0]
                    ?.medicalSpecialityName
                } ${
                  authenticatedUserDataState?.medicalSpecialities?.[1]
                    ?.medicalSpecialityName
                    ? authenticatedUserDataState?.medicalSpecialities?.[1]
                    : ""
                } ${
                  authenticatedUserDataState?.medicalSpecialities?.[2]
                    ?.medicalSpecialityName
                    ? authenticatedUserDataState?.medicalSpecialities?.[2]
                    : ""
                }`}
              />
            </div>
          </div>
          <div className="w-full flex flex-col space-y-5 mt-7">
            <div className="flex flex-col">
              <span className="font-bold text-lg">Symptoms</span>
              <span className="custom_underline">
                {medicalRecordPatientToView?.symptoms}
              </span>
              <div className="w-full">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="border-b-2 mb-2 pb-1 styled_line_height"
                  >
                    <span className="invisible">a</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Conducted Tests</span>
              <span className="custom_underline">
                {medicalRecordPatientToView?.conductedTests}
              </span>
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-b-2 mb-2 pb-1 styled_line_height"
                >
                  <span className="invisible">a</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Diagnostic</span>
              <span className="custom_underline">
                {medicalRecordPatientToView?.diagnosis}
              </span>
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-b-2 mb-2 pb-1 styled_line_height"
                >
                  <span className="invisible">a</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Recommendations</span>
              <span className="custom_underline">
                {medicalRecordPatientToView?.recommendations}
              </span>
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-b-2 mb-2 pb-1 styled_line_height"
                >
                  <span className="invisible">a</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-end text-xs font-bold mt-14 pr-24">
            <div className="flex flex-col space-y-2">
              <span>Doctor's Signature and Stamp:</span>
              <span>Date:</span>
            </div>
          </div>

          {/* {appointment.appointment.appointmentDateTime}
      {appointmentId}
      {medicalRecordPatientToView?.symptoms}
      {medicalRecordPatientToView?.diagnosis}
      {medicalRecordPatientToView?.conductedTests}
      {medicalRecordPatientToView?.recommendations} */}
        </div>
      </div>
    </>
  );
};
