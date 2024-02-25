import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppointmentTableData, MedicalRecordPatient } from "../../types";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { appointmentsPath } from "../../utils/dotenv";
import IatropolisLogo from "../../assets/logo-iatropolis.png";
import { StyledEntry } from "../../components/design/StyledEntry";
import { UnderlinedTextArea } from "../../components/design/UnderlinedTextArea";
import { MedicalProcedurePicker } from "../../components/pickers/MedicalProcedurePicker";

export const MedicalRecordPatientCreation: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
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
  const [medicalRecordPatientToCreate, setMedicalRecordPatientToCreate] =
    useState<MedicalRecordPatient>({
      appointmentId: "",
      symptoms: "",
      conductedTests: "",
      diagnosis: "",
      recommendations: "",
    });

  async function onGetAppointment() {
    try {
      const response = await axios.get(appointmentsPath, {
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
    onGetAppointment();
  }, [appointmentId]);

  function handleStyledInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setMedicalRecordPatientToCreate((prevMedicalRecordToCreate) => ({
      ...prevMedicalRecordToCreate,
      [name]: value,
    }));
  }

  useEffect(() => {
    console.log(medicalRecordPatientToCreate);
  }, [medicalRecordPatientToCreate]);

  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center mt-20 mb-20">
        <div
          ref={pageRef}
          className="page p-4 w-full h-full flex flex-col rounded-xl"
        >
          <img
            src={IatropolisLogo}
            alt="Iatropolis, Botosani"
            className="object-contain h-8 w-44"
          />
          <span className="w-full flex justify-center text-xl mb-6">
            Medical Record Patient Creation
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
                confirmationDialogEntryBody={""}
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
              <UnderlinedTextArea
                name="symptoms"
                onChangeUnderlinedTextAreaInput={handleStyledInputChange}
                underlinedTextAreaInput={medicalRecordPatientToCreate.symptoms}
              />
            </div>
            {/* <div className="flex flex-col">
              <span className="font-bold text-lg">Conducted Tests</span>
              <MedicalProcedurePicker />
            </div> */}

            <div className="flex flex-col">
              <span className="font-bold text-lg">Diagnosis</span>
              <UnderlinedTextArea
                name="diagnosis"
                onChangeUnderlinedTextAreaInput={handleStyledInputChange}
                underlinedTextAreaInput={medicalRecordPatientToCreate.diagnosis}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">Recommendations</span>
              <UnderlinedTextArea
                name="recommendations"
                onChangeUnderlinedTextAreaInput={handleStyledInputChange}
                underlinedTextAreaInput={
                  medicalRecordPatientToCreate.recommendations
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
