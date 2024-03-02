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
import {
  appointmentsPath,
  medicalRecordPatientsPath,
} from "../../utils/dotenv";
import IatropolisLogo from "../../assets/logo-iatropolis.png";
import { StyledEntry } from "../../components/design/StyledEntry";
import { UnderlinedTextArea } from "../../components/design/UnderlinedTextArea";
import { MedicalProcedurePicker } from "../../components/pickers/MedicalProcedurePicker";
import { useReactToPrint } from "react-to-print";
import { MedicalProcedurePickerMedicalRecord } from "../../components/pickers/MedicalProcedurePickerMedicalRecord";

export const MedicalRecordPatientCreation: FC = () => {
  const [foundConductedTests, setFoundConductedTests] = useState<any>([]);
  const [price, setPrice] = useState<number>(-1);
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

  async function onCreateMedicalRecordPatient() {
    try {
      const response = await axios.post(
        medicalRecordPatientsPath,
        {
          appointmentId: appointment.appointment.appointmentId,
          symptoms: medicalRecordPatientToCreate.symptoms,
          diagnosis: medicalRecordPatientToCreate.diagnosis,
          conductedTests: medicalRecordPatientToCreate.conductedTests,
          recommendations: medicalRecordPatientToCreate.recommendations,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const pageRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => pageRef.current,
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

  const [finalConductedTests, setFinalConductedTests] = useState<any>();
  useEffect(() => {
    const final = foundConductedTests.map((foundConductedTest) => ({
      medicalProcedureName: foundConductedTest.medicalProcedureName,
      medicalProcedurePrice: foundConductedTest.medicalProcedurePrice,
    }));

    setFinalConductedTests(final);
  }, [foundConductedTests]);

  useEffect(() => {
    console.log("final foundConductedTests", finalConductedTests, price);
    setMedicalRecordPatientToCreate((prevMedicalRecordPatient) => ({
      ...prevMedicalRecordPatient,
      conductedTests: finalConductedTests,
    }));
  }, [finalConductedTests, price]);

  return (
    <>
      {/* <button className="text-emerald-400" onClick={handlePrint}>
        Print
      </button> */}
      <span className="text-black" onClick={onCreateMedicalRecordPatient}>
        Create
      </span>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/2 h-full bg-white overflow-y-scroll">
          <div
            ref={pageRef}
            className=" p-4 w-full h-full flex flex-col rounded-x"
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
                    authenticatedUserDataState?.medicalSpecialities?.length >=
                      1 &&
                    authenticatedUserDataState?.medicalSpecialities![0]
                      .medicalSpecialityName
                  }, ${
                    authenticatedUserDataState?.medicalSpecialities?.length >=
                      2 &&
                    authenticatedUserDataState?.medicalSpecialities![1]
                      .medicalSpecialityName
                  }, ${
                    authenticatedUserDataState?.medicalSpecialities?.length >=
                      3 &&
                    authenticatedUserDataState?.medicalSpecialities![2]
                      .medicalSpecialityName
                  }`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col space-y-5 mt-7">
              <div className="flex flex-col test">
                <span className="font-bold text-lg ">Symptoms</span>
                <UnderlinedTextArea
                  name="symptoms"
                  onChangeUnderlinedTextAreaInput={handleStyledInputChange}
                  underlinedTextAreaInput={
                    medicalRecordPatientToCreate.symptoms
                  }
                />
              </div>
              <div className="w-full flex flex-col">
                <span className="font-bold text-lg">Conducted Tests</span>
                {/* <MedicalProcedurePicker /> */}
                <MedicalProcedurePickerMedicalRecord
                  foundConductedTests={foundConductedTests}
                  setFoundConductedTests={setFoundConductedTests}
                  price={price}
                  setPrice={setPrice}
                />
              </div>

              <div className="flex flex-col test">
                <span className="font-bold text-lg">Diagnosis</span>
                <UnderlinedTextArea
                  name="diagnosis"
                  onChangeUnderlinedTextAreaInput={handleStyledInputChange}
                  underlinedTextAreaInput={
                    medicalRecordPatientToCreate.diagnosis
                  }
                />
              </div>
              <div className="flex flex-col test">
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
      </div>
    </>
  );
};
