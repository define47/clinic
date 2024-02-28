import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  AppointmentTableData,
  GeneralTableProps,
  MedicalProcedure,
  MedicalSpeciality,
  Patient,
  TableRow,
  User,
} from "../../types";
import { CreateUserOverlay } from "../overlays/userOverlays/CreateUserOverlay";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";
import { UpdateUserOverlay } from "../overlays/userOverlays/UpdateUserOverlay";
import { DeleteUserOverlay } from "../overlays/userOverlays/DeleteUserOverlay";
import {
  doctorRoleId,
  doctorRoleName,
  patientRoleId,
  patientRoleName,
  receptionistRoleId,
  receptionistRoleName,
} from "../../utils/dotenv";
import { CreateMedicalSpecialityOverlay } from "../overlays/medicalSpecialityOverlays/CreateMedicalSpecialityOverlay";
import { DeleteMedicalSpecialityOverlay } from "../overlays/medicalSpecialityOverlays/DeleteMedicalSpecialityOverlay";
import { UpdateMedicalSpeciality } from "../overlays/medicalSpecialityOverlays/UpdateMedicalSpeciality";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiTreasureMapLine,
} from "react-icons/ri";
import { UserSearchCriterionPicker } from "../pickers/UserSearchCriterionPicker";
import { StyledInput } from "../design/StyledInput";
import { IoIosSearch } from "react-icons/io";
import { AppointmentSearchCriterionPicker } from "../pickers/AppointmentSearchCriterionPicker";
import { AppointmentPeriodPicker } from "../pickers/AppointmentPeriodPicker";
import { CreateAppointmentOverlay } from "../overlays/appointmentOverlays/CreateAppointmentOverlay";
import { UpdateAppointmentOverlay } from "../overlays/appointmentOverlays/UpdateAppointmentOverlay";
import { DeleteAppointmentOverlay } from "../overlays/appointmentOverlays/DeleteAppointmentOverlay";
import { MedicalSpecialityPicker } from "../pickers/MedicalSpecialityPicker";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "../design/Tooltip";
import { StyledRippleButton } from "../design/StyledRippleButton";
import { LimitPicker } from "../pickers/LimitPicker";
import { CreateMedicalProcedureOverlay } from "../overlays/medicalProcedureOverlays/CreateMedicalProcedureOverlay";
import { DeleteMedicalProcedureOverlay } from "../overlays/medicalProcedureOverlays/DeleteMedicalProcedureOverlay";
import { UpdateMedicalProcedureOverlay } from "../overlays/medicalProcedureOverlays/UpdateMedicalProcedureOverlay";
import { useReactToPrint } from "react-to-print";
import useDeviceDetection from "../../utils/useDeviceDetection";
import { CardEntry } from "../design/card/CardEntry";
import { CreateMedicalRecordPatientOverlay } from "../overlays/medicalRecordPatientOverlays/CreateMedicalRecordPatientOverlay";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { SendEmailOverlay } from "../overlays/emailOverlays/SendEmailOverlay";
import { ViewMedicalRecordPatientOverlay } from "../overlays/medicalRecordPatientOverlays/ViewMedicalRecordPatientOverlay";
import { StyledInputV2 } from "../design/StyledInputV2";
import {
  getAppointmentTableColumnNamesByLanguage,
  getItemByLanguageAndCollection,
  getItemInUserSelectedLanguageCode,
} from "../../utils/clientLanguages";
import { StyledAppointmentStatusName } from "../design/StyledAppointmentStatusName";
import { Toaster } from "sonner";
import { capitalizeString } from "../../utils/utils";
import { OrderByIndicator } from "./OrderByIndicator";

import { UserHeader } from "./headers/UserHeader";
import { AppointmentHeader } from "./headers/AppointmentHeader";
import { MedicalSpecialityHeader } from "./headers/MedicalSpecialityHeader";
import { MedicalProcedureHeader } from "./headers/MedicalProcedureHeader";
import { UserBody } from "./bodies/UserBody";
import { MedicalSpecialityBody } from "./bodies/MedicalSpecialityBody";
import { AppointmentBody } from "./bodies/AppointmentBody";
import {
  isAppointmentRow,
  isMedicalProcedureRow,
  isMedicalSpecialityRow,
  isUserRow,
} from "../../utils/typeGuards";

export const GeneralTable: FC<GeneralTableProps> = ({
  URL,
  entity,
  // roleId,
  // roleName,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [tableTotalCount, setTableTotalCount] = useState<number>(0);
  const [tableTotalPages, setTableTotalPages] = useState<number>(0);
  const [tableLimit, setTableLimit] = useState<number>(999);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [clickedTableRow, setClickedTableRow] = useState<TableRow>();
  const [orderByIndicator, setOrderByIndicator] = useState<string>("");
  const [roleId, setRoleId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUserSearchCriteriaName, setSelectedUserSearchCriteriaName] =
    useState<string>("");
  const [selectedUserSearchCriteriaValue, setSelectedUserSearchCriteriaValue] =
    useState<string>("");

  const [selectedTable, setSelectedTable] = useState<string>("");
  const [
    selectedAppointmentCriteriaValue,
    setSelectedAppointmentCriteriaValue,
  ] = useState<string>("");
  const [selectedAppointmentCriteriaName, setSelectedAppointmentCriteriaName] =
    useState<string>("");

  const [selectedAppointmentPeriodValue, setSelectedAppointmentPeriodValue] =
    useState<string>("");

  const [selectedMedicalSpecialityId, setSelectedMedicalSpecialityId] =
    useState<string>("");
  const [selectedMedicalSpecialityName, setSelectedMedicalSpecialityName] =
    useState<string>("");

  const [
    isCreateAppointmentOverlayVisible,
    setIsCreateAppointmentOverlayVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (entity === "patient") {
      setRoleId(patientRoleId);
    } else if (entity === "doctor") setRoleId(doctorRoleId);
    else if (entity === "receptionist") setRoleId(receptionistRoleId);

    // else if (entity === "nurse")
    // setRoleId(nurse)
  }, [entity]);

  async function fetchTableData() {
    try {
      let queryParams = {};

      if (
        entity === "patient" ||
        entity === "doctor" ||
        entity === "receptionist"
      )
        queryParams = {
          roleId,
          searchBy: selectedUserSearchCriteriaValue,
          searchQuery,
          limit: tableLimit,
          page: currentPage,
          orderBy: orderByIndicator ? orderByIndicator : "asc:userForename",
        };
      else if (entity === "medicalSpeciality")
        queryParams = {
          searchQuery,
          limit: tableLimit,
          page: currentPage,
          orderBy: orderByIndicator,
        };
      else if (entity === "appointment")
        queryParams = {
          message: "appointments",
          searchInTable: selectedTable !== "" ? selectedTable : "doctor",
          orderInTable: "doctor",
          searchBy:
            selectedAppointmentCriteriaValue !== ""
              ? selectedAppointmentCriteriaValue
              : "userForename",
          searchQuery,
          scheduleFilter:
            selectedAppointmentPeriodValue === ""
              ? "today"
              : selectedAppointmentPeriodValue,
          // scheduleFilter: "custom",
          customStartDate: "2024-02-09",
          customEndDate: "2024-02-09",
          orderBy: "desc:userForename",
          limit: tableLimit,
          page: currentPage,
          doctorId:
            (authenticatedUserDataState.roleNames[0] === "doctor" ||
              authenticatedUserDataState.roleNames[1] === "doctor") &&
            authenticatedUserDataState.roleNames[0] !== "admin" &&
            authenticatedUserDataState.roleNames[1] !== "admin"
              ? authenticatedUserDataState.userId
              : "",
          patientId: "",
        };
      else if (entity === "medicalProcedure") {
        queryParams = {
          message: "medicalProceduresByMedicalSpeciality",
          medicalSpecialityId: selectedMedicalSpecialityId.substring(1),
          searchQuery,
          limit: tableLimit,
          page: currentPage,
          orderBy: orderByIndicator,
        };
      }

      const response = await axios.get(URL, {
        params: {
          ...queryParams,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setTableRows(response.data.payload.tableData);
        setTableTotalCount(response.data.payload.totalCount);
        setTableTotalPages(response.data.payload.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, [
    entity,
    roleId,
    orderByIndicator,
    searchQuery,
    selectedUserSearchCriteriaValue,
    selectedTable,
    selectedAppointmentCriteriaValue,
    selectedAppointmentPeriodValue,
    selectedMedicalSpecialityId,
    currentPage,
    tableLimit,
  ]);

  useEffect(() => {
    setCurrentPage(0);
  }, [tableLimit]);

  useEffect(() => {
    console.log(
      "here period",
      getItemByLanguageAndCollection("ro", "appointmentTableColumnNames", 0)
    );
  }, []);

  useEffect(() => {
    if (socketNotificationDataState) {
      const receivedSocketData = JSON.parse(socketNotificationDataState);
      const receivedAction = receivedSocketData.action;
      const receivedEntity = receivedSocketData.entity;
      let receivedData = receivedSocketData.data;

      console.log("socket data", receivedData, "socket action", receivedAction);

      // console.log(
      //   "🚀 ~ useEffect ~ socketNotificationDataState:",
      //   receivedSocketData
      // );

      // console.log("🚀 ~ useEffect ~ action:", action);

      // console.log("receivedSocketData", data);

      if (
        receivedAction === "createUser" &&
        receivedData.roles[0] === entity &&
        (pathname === `/admins/${entity}s` ||
          pathname === `/receptionists/${entity}s`)
      ) {
        const user = receivedData.user as User;
        const roles = receivedData.roles as string[];
        const medicalSpecialities =
          receivedData.medicalSpecialities as string[];

        setTableRows((prevUsers: TableRow[]) => [
          {
            userId: user.userId,
            userForename: user.userForename,
            userSurname: user.userSurname,
            userEmail: user.userEmail,
            userPhoneNumber: user.userPhoneNumber,
            userGender: user.userGender,
            userDateOfBirth: user.userDateOfBirth,
            userAddress: user.userAddress,
            userRoleName: roles[0],
            ...(roles[0] === "doctor" && {
              medicalSpecialities: medicalSpecialities,
            }),
            ...(roles[0] === "patient" && {
              userCNP: user.userCNP,
            }),
          } as User,
          ...prevUsers,
        ]);
      } else if (receivedAction === "deleteUser") {
        setTableRows((prevUsers: TableRow[]) =>
          prevUsers.filter((user: TableRow) => {
            if ("userId" in user) {
              return user.userId !== receivedData;
            }
            return true;
          })
        );
      } else if (receivedAction === "updateUser") {
        const user = receivedData.user as User;
        console.log("user related data update", user);

        const roles = receivedData.roles as string[];
        const medicalSpecialities =
          receivedData.medicalSpecialities as string[];

        setTableRows((prevUsers: TableRow[]) => {
          const updatedEvents = prevUsers.map((event: TableRow) => {
            if (isUserRow(event) && event.userId === user.userId) {
              return {
                ...event,
                userId: user.userId,
                userForename: user.userForename,
                userSurname: user.userSurname,
                userEmail: user.userEmail,
                userPhoneNumber: user.userPhoneNumber,
                userGender: user.userGender,
                userDateOfBirth: user.userDateOfBirth,
                userAddress: user.userAddress,
                ...(roles?.length >= 1 &&
                  roles[0] === "doctor" &&
                  medicalSpecialities?.length >= 1 && {
                    medicalSpecialities: medicalSpecialities,
                  }),
                // medicalSpecialities,
                ...(roles[0] === "patient" && {
                  userCNP: user.userCNP,
                }),
              };
            } else {
              return event;
            }
          });
          return updatedEvents;
        });
      } else if (
        receivedAction === "createMedicalSpeciality" &&
        receivedEntity === entity
      ) {
        receivedData = receivedData as MedicalSpeciality;
        setTableRows((prevMedicalSpecialities: TableRow[]) => [
          {
            medicalSpecialityId: receivedData.medicalSpecialityId,
            medicalSpecialityName: receivedData.medicalSpecialityName,
          } as MedicalSpeciality,
          ...prevMedicalSpecialities,
        ]);
      } else if (receivedAction === "deleteMedicalSpeciality") {
        setTableRows((prevMedicalSpecialities: TableRow[]) =>
          prevMedicalSpecialities.filter((medicalSpeciality: TableRow) => {
            if ("medicalSpecialityId" in medicalSpeciality) {
              return medicalSpeciality.medicalSpecialityId !== receivedData;
            }
            return true;
          })
        );
      } else if (receivedAction === "updateMedicalSpeciality") {
        receivedData = receivedData as MedicalSpeciality;
        setTableRows((prevMedicalSpecialities: TableRow[]) => {
          const updatedEvents = prevMedicalSpecialities.map(
            (event: TableRow) => {
              if (
                isMedicalSpecialityRow(event) &&
                event.medicalSpecialityId === receivedData.medicalSpecialityId
              ) {
                return {
                  ...event,
                  medicalSpecialityId: receivedData.medicalSpecialityId,
                  medicalSpecialityName: receivedData.medicalSpecialityName,
                };
              } else {
                return event;
              }
            }
          );
          return updatedEvents;
        });
      } else if (
        receivedAction === "createMedicalProcedure" &&
        receivedEntity === entity
      ) {
        const medicalSpecialityId = receivedData.medicalSpecialityId as string;
        const medicalProcedure =
          receivedData.medicalProcedure as MedicalProcedure;

        if (medicalSpecialityId === selectedMedicalSpecialityId)
          setTableRows((prevMedicalProcedures: TableRow[]) => [
            {
              medicalProcedureId: medicalProcedure.medicalProcedureId,
              medicalProcedureName: medicalProcedure.medicalProcedureName,
              medicalProcedurePrice: medicalProcedure.medicalProcedurePrice,
            } as MedicalProcedure,
            ...prevMedicalProcedures,
          ]);
      } else if (receivedAction === "updateMedicalProcedure") {
        receivedData = receivedData as MedicalProcedure;

        console.log("data medical procedure update", receivedData);

        setTableRows((prevMedicalProcedures: TableRow[]) => {
          const updatedEvents = prevMedicalProcedures.map((event: TableRow) => {
            if (
              isMedicalProcedureRow(event) &&
              event.medicalProcedureId === receivedData.medicalProcedureId
            ) {
              return {
                ...event,
                medicalProcedureId: receivedData.medicalProcedureId,
                medicalProcedureName: receivedData.medicalProcedureName,
                medicalProcedurePrice: receivedData.medicalProcedurePrice,
              };
            } else {
              return event;
            }
          });
          return updatedEvents;
        });
      } else if (receivedAction === "deleteMedicalProcedure") {
        setTableRows((prevMedicalProcedures: TableRow[]) =>
          prevMedicalProcedures.filter((medicalProcedure: TableRow) => {
            if ("medicalProcedureId" in medicalProcedure) {
              return medicalProcedure.medicalProcedureId !== receivedData;
            }
            return true;
          })
        );
      } else if (
        receivedAction === "createAppointment" &&
        receivedEntity === entity &&
        ((authenticatedUserDataState.roleNames[0] === "doctor" &&
          authenticatedUserDataState.userId === receivedData.doctor.doctorId) ||
          authenticatedUserDataState.roleNames[0] === "receptionist" ||
          authenticatedUserDataState.roleNames[0] === "admin")
      ) {
        receivedData = receivedData as AppointmentTableData;
        console.log(
          "appointment data event",
          receivedData.appointment.appointmentId
        );

        setTableRows((prevAppointments: TableRow[]) => [
          {
            // appointment: {
            // appointmentId: data.appointment.appointmentId,
            // appointmentDoctorId: data.appointment.appointmentDoctorId,
            // appointmentPatientId: data.appointment.appointmentPatientId,
            // appointmentReason: data.appointment.appointmentReason,
            // appointmentDateTime: data.appointment.appointmentDateTime,
            // appointmentStatus: data.appointment.appointmentStatus,
            // appointmentCancellationReason:
            //   data.appointment.appointmentCancellationReason,
            // },
            // doctor: {
            //   doctorId: data.doctor.doctorId,
            //   doctorForename: data.doctor.doctorForename,
            //   doctorSurname: data.doctor.doctorSurname,
            // },
            // patient: {
            //   patientId: data.patientId.patientId,
            //   patientForename: data.patientId.patientForename,
            //   patientSurname: data.patientId.patientSurname,
            //   patientEmail: data.patientId.patientEmail,
            // },
            ...receivedData,
          } as AppointmentTableData,
          ...prevAppointments,
        ]);
      } else if (receivedAction === "updateAppointment") {
        receivedData = receivedData as AppointmentTableData;

        console.log("data medical procedure update", receivedData);

        setTableRows((prevAppointments: TableRow[]) => {
          const updatedEvents = prevAppointments.map((event: TableRow) => {
            if (
              isAppointmentRow(event) &&
              event.appointment.appointmentId ===
                receivedData.appointment.appointmentId
            ) {
              return {
                ...event,
                ...receivedData,
              };
            } else {
              return event;
            }
          });
          return updatedEvents;
        });
      } else if (receivedAction === "deleteAppointment") {
        console.log("data to delete", receivedData);

        setTableRows((prevAppointments: TableRow[]) =>
          prevAppointments.filter((appointment: TableRow) => {
            // if ('appointmentId' in appointment.appointment) {
            return (
              (appointment as AppointmentTableData).appointment
                .appointmentId !== receivedData
            );
            // }
            // return true;
          })
        );
      }
    }

    // if (
    //   socketNotificationDataState &&
    //   socketNotificationDataState !== undefined
    // ) {
    //   console.log("Received Data:", socketNotificationDataState);
    //   let receivedData = socketNotificationDataState;
    //   console.log(
    //     "🚀 ~ useEffect ~ receivedData:",
    //     JSON.parse(
    //       (receivedData as unknown as MedicalSpeciality).medicalSpecialityName
    //     )
    //   );
    // }

    // setTableRows((prevUsers: TableRow[]) => [
    //   {
    //     userId: "userIdTest",
    //     userForename: "",
    //     userSurname: "",
    //     userEmail: "",
    //     userPhoneNumber: "",
    //     userGender: "",
    //     userDateOfBirth: "",
    //     userAddress: "",
    //     userEncryptedPassword: "",
    //     isUserEmailActivated: false,
    //     isUserApprovedByAdmin: false,
    //     isUserBanned: false,
    //     userRoleId: "",
    //     userRoleName: "",
    //   } as User,
    //   ...prevUsers,
    // ]);
  }, [socketNotificationDataState, selectedMedicalSpecialityId, pathname]);

  function determineSpecialityOrder(
    medicalSpecialities: string[],
    target: string
  ) {
    for (let i = 0; i < medicalSpecialities.length; i++) {
      if (medicalSpecialities[i].includes(target))
        return medicalSpecialities[i];
    }
  }

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => console.log("print completed"),
  });

  const { device, orientation } = useDeviceDetection();
  useEffect(() => {
    console.log(`General Table Current device type: ${device} ${orientation}`);
  }, [device, orientation]);

  return device === "Desktop" ? (
    <div className="w-full bg-lightMode-tableBackgroundColor dark:bg-darkMode-tableBackgroundColor dark:text-gray-500 h-full border border-lightMode-borderColor dark:border-darkMode-borderColor p-4 rounded-xl font-roboto">
      {/* <div className="flex items-center justify-between">
        {(entity === "doctor" ||
          entity === "patient" ||
          entity === "receptionist" ||
          entity === "nurse") && (
          <div className="w-full flex items-center space-x-3 mb-3">
            <div className="w-1/5">
              <UserSearchCriterionPicker
                entity={entity}
                selectedUserSearchCriteriaName={selectedUserSearchCriteriaName}
                setSelectedUserSearchCriteriaName={
                  setSelectedUserSearchCriteriaName
                }
                selectedUserSearchCriteriaValue={
                  selectedUserSearchCriteriaValue
                }
                setSelectedUserSearchCriteriaValue={
                  setSelectedUserSearchCriteriaValue
                }
              />
            </div>
            {selectedUserSearchCriteriaValue !== "" && (
              <div className="w-full">
                <StyledInputV2
                  unfocusedTextColor="text-pink-600"
                  unfocusedBorderColor="border-pink-600"
                  focusedTextColor="focus:text-pink-600"
                  focusedBorderColor="focus:border-pink-600"
                  unfocusedLabelColor="text-pink-600"
                  unfocusedLabelBackgroundColor="bg-white"
                  focusedLabelColor="text-pink-600"
                  focusedLabelBackgroundColor="bg-white"
                  onClickIcon={() => {}}
                  isDisabled={false}
                  label={`${entity} search`}
                  name={`userSearch`}
                  icon={<IoIosSearch />}
                  onChangeStyledInput={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  styledInputValue={searchQuery}
                  styledInputWidth="w-full"
                />
              </div>
            )}
          </div>
        )}
        {entity === "medicalSpeciality" && (
          <div className="w-1/5 mb-3">
            <StyledInputV2
              unfocusedTextColor="text-pink-600"
              unfocusedBorderColor="border-pink-600"
              focusedTextColor="focus:text-pink-600"
              focusedBorderColor="focus:border-pink-600"
              unfocusedLabelColor="text-pink-600"
              unfocusedLabelBackgroundColor="bg-white"
              focusedLabelColor="text-pink-600"
              focusedLabelBackgroundColor="bg-white"
              onClickIcon={() => {}}
              isDisabled={false}
              label={`${entity} search`}
              name={`medicalSpecialitySearch`}
              icon={<IoIosSearch />}
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              styledInputValue={searchQuery}
              styledInputWidth="w-full"
            />
          </div>
        )}

        {entity === "appointment" && (
          <div className="w-full flex space-x-3 mb-3">
            <div className="w-1/2">
              <AppointmentSearchCriterionPicker
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                selectedAppointmentCriteriaName={
                  selectedAppointmentCriteriaName
                }
                setSelectedAppointmentCriteriaName={
                  setSelectedAppointmentCriteriaName
                }
                selectedAppointmentCriteriaValue={
                  selectedAppointmentCriteriaValue
                }
                setSelectedAppointmentCriteriaValue={
                  setSelectedAppointmentCriteriaValue
                }
              />{" "}
            </div>
            {selectedTable !== "" &&
              selectedAppointmentCriteriaValue !== "" && (
                <div className="w-1/2">
                  <StyledInputV2
                    unfocusedTextColor="text-pink-600"
                    unfocusedBorderColor="border-pink-600"
                    focusedTextColor="focus:text-pink-600"
                    focusedBorderColor="focus:border-pink-600"
                    unfocusedLabelColor="text-pink-600"
                    unfocusedLabelBackgroundColor="bg-white"
                    focusedLabelColor="text-pink-600"
                    focusedLabelBackgroundColor="bg-white"
                    onClickIcon={() => {}}
                    isDisabled={false}
                    label={`${entity} search`}
                    name={`appointmentSearch`}
                    icon={<IoIosSearch />}
                    onChangeStyledInput={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    styledInputValue={searchQuery}
                    styledInputWidth="w-full"
                  />
                </div>
              )}
          </div>
        )}
        {entity === "medicalProcedure" && (
          <div className="w-1/6">
            <StyledInputV2
              unfocusedTextColor="text-pink-600"
              unfocusedBorderColor="border-pink-600"
              focusedTextColor="focus:text-pink-600"
              focusedBorderColor="focus:border-pink-600"
              unfocusedLabelColor="text-pink-600"
              unfocusedLabelBackgroundColor="bg-white"
              focusedLabelColor="text-pink-600"
              focusedLabelBackgroundColor="bg-white"
              onClickIcon={() => {}}
              isDisabled={false}
              label={`${entity} search`}
              name={`medicalProcedureSearch`}
              icon={<IoIosSearch />}
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              styledInputValue={searchQuery}
              styledInputWidth="w-full"
            />
          </div>
        )}

        {entity === "medicalProcedure" && (
          <MedicalSpecialityPicker
            label="select medical speciality"
            selectedMedicalSpecialityId={selectedMedicalSpecialityId}
            setSelectedMedicalSpecialityId={setSelectedMedicalSpecialityId}
            selectedMedicalSpecialityName={selectedMedicalSpecialityName}
            setSelectedMedicalSpecialityName={setSelectedMedicalSpecialityName}
          />
        )}

        {entity === "appointment" && (
          <AppointmentPeriodPicker
            selectedAppointmentPeriodValue={selectedAppointmentPeriodValue}
            setSelectedAppointmentPeriodValue={
              setSelectedAppointmentPeriodValue
            }
          />
        )}

        <LimitPicker
          selectedLimit={tableLimit}
          setSelectedLimit={setTableLimit}
        />
      </div> */}
      <div className="w-full flex justify-between items-center mb-2">
        {(entity === "doctor" ||
          entity === "patient" ||
          entity === "receptionist" ||
          entity === "nurse") && (
          <div className="w-96 mr-3">
            <UserSearchCriterionPicker
              entity={entity}
              selectedUserSearchCriteriaName={selectedUserSearchCriteriaName}
              setSelectedUserSearchCriteriaName={
                setSelectedUserSearchCriteriaName
              }
              selectedUserSearchCriteriaValue={selectedUserSearchCriteriaValue}
              setSelectedUserSearchCriteriaValue={
                setSelectedUserSearchCriteriaValue
              }
            />
          </div>
        )}
        {entity === "appointment" && (
          <div className="w-96 mr-3">
            <AppointmentSearchCriterionPicker
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              selectedAppointmentCriteriaName={selectedAppointmentCriteriaName}
              setSelectedAppointmentCriteriaName={
                setSelectedAppointmentCriteriaName
              }
              selectedAppointmentCriteriaValue={
                selectedAppointmentCriteriaValue
              }
              setSelectedAppointmentCriteriaValue={
                setSelectedAppointmentCriteriaValue
              }
            />
          </div>
        )}
        {(selectedUserSearchCriteriaValue !== "" ||
          entity === "medicalSpeciality" ||
          selectedAppointmentCriteriaValue !== "" ||
          selectedMedicalSpecialityId !== "") && (
          <div className="w-96 mr-3">
            <StyledInputV2
              unfocusedTextColor="text-pink-600"
              unfocusedBorderColor="border-pink-600"
              focusedTextColor="focus:text-pink-600"
              focusedBorderColor="focus:border-pink-600"
              focusedBorderColorIconArea="border-pink-600"
              unfocusedLabelColor="text-pink-600"
              unfocusedLabelBackgroundColor="bg-white"
              focusedLabelColor="text-pink-600"
              focusedLabelBackgroundColor="bg-white"
              onClickIcon={() => {}}
              isDisabled={false}
              // label={`${entity} search`}
              label={
                entity === "appointment"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      0
                    )
                  : entity === "patient"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      1
                    )
                  : entity === "doctor"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      2
                    )
                  : entity === "medicalSpeciality"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      3
                    )
                  : entity === "medicalProcedure"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      4
                    )
                  : entity === "nurse"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      5
                    )
                  : entity === "receptionist"
                  ? getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "searchFieldNames",
                      6
                    )
                  : ""
              }
              name={`userSearch`}
              icon={<IoIosSearch />}
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              styledInputValue={searchQuery}
              styledInputWidth="w-full"
            />
          </div>
        )}
        {entity === "appointment" && (
          <div className="w-96">
            <AppointmentPeriodPicker
              selectedAppointmentPeriodValue={selectedAppointmentPeriodValue}
              setSelectedAppointmentPeriodValue={
                setSelectedAppointmentPeriodValue
              }
            />
          </div>
        )}
        {entity === "medicalProcedure" && (
          <div className="w-full flex items-center justify-center">
            <div className="w-96 mr-3">
              <MedicalSpecialityPicker
                medicalSpecialityRank=""
                label={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "medicalSpecialityPickerLabels",
                  0
                )}
                selectedMedicalSpecialityId={selectedMedicalSpecialityId}
                setSelectedMedicalSpecialityId={setSelectedMedicalSpecialityId}
                selectedMedicalSpecialityName={selectedMedicalSpecialityName}
                setSelectedMedicalSpecialityName={
                  setSelectedMedicalSpecialityName
                }
                z="z-50"
              />
            </div>
          </div>
        )}

        <div className="w-96">
          <LimitPicker
            selectedLimit={tableLimit}
            setSelectedLimit={setTableLimit}
          />
        </div>
      </div>
      <div
        ref={componentRef}
        className="w-full border border-lightMode-borderColor dark:border-darkMode-borderColor rounded-xl h-4/5 overflow-auto hidden lg:block"
      >
        {tableRows.length > 0 && (
          <table className="w-full text-center text-xs font-light border rounded-xl">
            <thead className="w-full border-b border-lightMode-borderColor dark:border-darkMode-borderColor bg-lightMode-tableHeaderBackgroundColor dark:bg-darkMode-tableHeaderBackgroundColor font-medium">
              {isUserRow(tableRows[0]) ? (
                <UserHeader
                  entity={entity}
                  orderByIndicator={orderByIndicator}
                  setOrderByIndicator={setOrderByIndicator}
                />
              ) : isMedicalSpecialityRow(tableRows[0]) ? (
                <MedicalSpecialityHeader
                  orderByIndicator={orderByIndicator}
                  setOrderByIndicator={setOrderByIndicator}
                />
              ) : isAppointmentRow(tableRows[0]) ? (
                <AppointmentHeader
                  orderByIndicator={orderByIndicator}
                  setOrderByIndicator={setOrderByIndicator}
                />
              ) : isMedicalProcedureRow(tableRows[0]) ? (
                <MedicalProcedureHeader
                  orderByIndicator={orderByIndicator}
                  setOrderByIndicator={setOrderByIndicator}
                />
              ) : (
                ""
              )}
            </thead>
            <tbody>
              {tableRows.map((tableRow: TableRow, tableRowIndex: number) =>
                isUserRow(tableRow) ? (
                  <UserBody
                    entity={entity}
                    tableRow={tableRow}
                    tableRowIndex={tableRowIndex}
                    clickedTableRow={clickedTableRow}
                    setClickedTableRow={setClickedTableRow}
                    currentPage={currentPage}
                  />
                ) : isMedicalSpecialityRow(tableRow) ? (
                  <MedicalSpecialityBody
                    tableRow={tableRow}
                    currentPage={currentPage}
                    tableRowIndex={tableRowIndex}
                    clickedTableRow={clickedTableRow}
                    setClickedTableRow={setClickedTableRow}
                  />
                ) : isAppointmentRow(tableRow) ? (
                  <AppointmentBody
                    tableRow={tableRow}
                    currentPage={currentPage}
                    tableRowIndex={tableRowIndex}
                    clickedTableRow={clickedTableRow}
                    setClickedTableRow={setClickedTableRow}
                  />
                ) : isMedicalProcedureRow(tableRow) ? (
                  <tr
                    key={tableRow.medicalProcedureId}
                    className={`border-b border-lightMode-borderColor dark:border-darkMode-borderColor odd:bg-lightMode-oddRowTable even:bg-lightMode-evenRowTable odd:dark:bg-darkMode-oddRowTable even:dark:bg-darkMode-evenRowTable transition duration-300 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable ${
                      (clickedTableRow as MedicalProcedure)
                        ?.medicalProcedureId === tableRow.medicalProcedureId &&
                      "!bg-lightMode-selectedTableRow dark:!bg-darkMode-selectedTableRow"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
                    <td>{tableRowIndex}</td>
                    <td className="px-6 py-4 text-xs">
                      {tableRow.medicalProcedureId}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {tableRow.medicalProcedureName}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {tableRow.medicalProcedurePrice}
                    </td>
                    <td className="h-14 flex items-center justify-center space-x-2 px-6 py-4 text-xs">
                      <UpdateMedicalProcedureOverlay
                        medicalProcedure={tableRow}
                      />
                      <DeleteMedicalProcedureOverlay
                        medicalSpecialityId={selectedMedicalSpecialityId}
                        medicalProcedure={tableRow}
                      />
                    </td>
                  </tr>
                ) : (
                  ""
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <div className="w-full flex items-start justify-start">
          {currentPage > 0 && (
            <StyledRippleButton
              label={getItemByLanguageAndCollection(
                authenticatedUserDataState.language.languageCode,
                "pageNavigationButtonNames",
                0
              )}
              type="create"
              onClick={() => {
                if (currentPage > 0) setCurrentPage(currentPage - 1);
              }}
            />
          )}
        </div>

        <span className="w-full flex items-center justify-center">
          {currentPage + 1}
        </span>
        <div className="w-full flex items-end justify-end">
          {currentPage < tableTotalPages && (
            <StyledRippleButton
              label={getItemByLanguageAndCollection(
                authenticatedUserDataState.language.languageCode,
                "pageNavigationButtonNames",
                1
              )}
              type="create"
              onClick={() => {
                if (currentPage < tableTotalPages)
                  setCurrentPage(currentPage + 1);
              }}
            />
          )}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <span>total count: {tableTotalCount}</span>
        <span>total pages: {tableTotalPages + 1}</span>
      </div>
      <div>
        {(entity === patientRoleName ||
          entity === doctorRoleName ||
          entity === receptionistRoleName) && (
          <CreateUserOverlay roleId={roleId} roleName={entity} />
        )}
        {entity === "medicalSpeciality" && <CreateMedicalSpecialityOverlay />}
        {entity === "appointment" &&
          (authenticatedUserDataState.roleNames[0] === "admin" ||
            authenticatedUserDataState.roleNames[0] === "receptionist" ||
            authenticatedUserDataState.roleNames[1] === "admin") && (
            <CreateAppointmentOverlay
              isCreateAppointmentOverlayVisible={
                isCreateAppointmentOverlayVisible
              }
              setIsCreateAppointmentOverlayVisible={
                setIsCreateAppointmentOverlayVisible
              }
            />
          )}
        {entity === "medicalProcedure" &&
          selectedMedicalSpecialityId !== "" && (
            <CreateMedicalProcedureOverlay
              medicalSpecialityId={selectedMedicalSpecialityId}
              medicalSpecialityName={selectedMedicalSpecialityName}
            />
          )}
      </div>
      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
      <div className="absolute top-0 right-0 z-50">
        <Toaster position="top-right" richColors />
      </div>
    </div>
  ) : (
    <div className="h-full bg-white">
      <div className="flex flex-col">
        {(entity === "doctor" ||
          entity === "patient" ||
          entity === "receptionist" ||
          entity === "nurse") && (
          <div className="flex flex-col items-center space-y-2 mb-3">
            <UserSearchCriterionPicker
              entity={entity}
              selectedUserSearchCriteriaName={selectedUserSearchCriteriaName}
              setSelectedUserSearchCriteriaName={
                setSelectedUserSearchCriteriaName
              }
              selectedUserSearchCriteriaValue={selectedUserSearchCriteriaValue}
              setSelectedUserSearchCriteriaValue={
                setSelectedUserSearchCriteriaValue
              }
            />
            {selectedUserSearchCriteriaValue !== "" && (
              <div className="relative">
                <StyledInput
                  label={`${entity} search`}
                  name="name"
                  onChangeStyledInput={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  icon={<IoIosSearch />}
                />
              </div>
            )}
          </div>
        )}
        {entity === "medicalSpeciality" && (
          <div className="mb-3">
            <div className="relative">
              <StyledInput
                label={`${entity} search`}
                name="medicalSpecialitySearch"
                onChangeStyledInput={(event) =>
                  setSearchQuery(event.target.value)
                }
                icon={<IoIosSearch />}
              />
            </div>
          </div>
        )}

        {entity === "appointment" && (
          <div className="flex space-x-3 mb-3">
            <AppointmentSearchCriterionPicker
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              selectedAppointmentCriteriaName={selectedAppointmentCriteriaName}
              setSelectedAppointmentCriteriaName={
                setSelectedAppointmentCriteriaName
              }
              selectedAppointmentCriteriaValue={
                selectedAppointmentCriteriaValue
              }
              setSelectedAppointmentCriteriaValue={
                setSelectedAppointmentCriteriaValue
              }
            />
            {selectedTable !== "" &&
              selectedAppointmentCriteriaValue !== "" && (
                <StyledInput
                  label={`${entity} search`}
                  name="appointmentSearch"
                  onChangeStyledInput={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  icon={<IoIosSearch />}
                />
              )}

            {/* <AppointmentPeriodPicker
            selectedAppointmentPeriodValue={selectedAppointmentPeriodValue}
            setSelectedAppointmentPeriodValue={
              setSelectedAppointmentPeriodValue
            }
          /> */}
          </div>
        )}
        {entity === "medicalProcedure" && (
          <div className="flex mb-3">
            <div className="flex-none">
              <div className="relative">
                <StyledInput
                  label={`medical procedure search`}
                  name="medicalProcedureSearch"
                  onChangeStyledInput={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  icon={<IoIosSearch />}
                />
              </div>
            </div>
            {/* <div className="grow flex justify-center items-center">
            <MedicalSpecialityPicker
              label="select medical speciality"
              selectedMedicalSpecialityId={selectedMedicalSpecialityId}
              setSelectedMedicalSpecialityId={setSelectedMedicalSpecialityId}
              selectedMedicalSpecialityName={selectedMedicalSpecialityName}
              setSelectedMedicalSpecialityName={
                setSelectedMedicalSpecialityName
              }
            />
          </div>
          <div className="w-72 flex-none"></div> */}
          </div>
          // <div className="flex ">
          //   <div className="flex-none w-14 h-14 ...">01</div>
          //   <div className="flex justify-center items-center grow bg-red-200 h-14 ...">
          //     02
          //   </div>
          //   <div className="flex-none w-14 h-14 ...">03</div>
          // </div>
        )}

        {entity === "medicalProcedure" && (
          <MedicalSpecialityPicker
            medicalSpecialityRank=""
            label="select medical speciality"
            selectedMedicalSpecialityId={selectedMedicalSpecialityId}
            setSelectedMedicalSpecialityId={setSelectedMedicalSpecialityId}
            selectedMedicalSpecialityName={selectedMedicalSpecialityName}
            setSelectedMedicalSpecialityName={setSelectedMedicalSpecialityName}
            z="z-50"
          />
        )}

        {entity === "appointment" && (
          <AppointmentPeriodPicker
            selectedAppointmentPeriodValue={selectedAppointmentPeriodValue}
            setSelectedAppointmentPeriodValue={
              setSelectedAppointmentPeriodValue
            }
          />
        )}

        <LimitPicker
          selectedLimit={tableLimit}
          setSelectedLimit={setTableLimit}
        />
      </div>
      <div>
        {(entity === patientRoleName ||
          entity === doctorRoleName ||
          entity === receptionistRoleName) && (
          <CreateUserOverlay roleId={roleId} roleName={entity} />
        )}
        {entity === "medicalSpeciality" && <CreateMedicalSpecialityOverlay />}
        {entity === "appointment" && (
          <CreateAppointmentOverlay
            isCreateAppointmentOverlayVisible={
              isCreateAppointmentOverlayVisible
            }
            setIsCreateAppointmentOverlayVisible={
              setIsCreateAppointmentOverlayVisible
            }
          />
        )}
        {entity === "medicalProcedure" && (
          <CreateMedicalProcedureOverlay
            medicalSpecialityId={selectedMedicalSpecialityId}
            medicalSpecialityName={selectedMedicalSpecialityName}
          />
        )}
      </div>
      {tableRows.map((tableRow: TableRow, tableRowIndex: number) =>
        isUserRow(tableRow) ? (
          <div className="h-auto border rounded-xl bg-white shadow-2xl shadow-black/40 text-xs mb-4">
            <div className="w-full flex flex-col">
              <CardEntry
                cardEntryTitle="Forename"
                cardEntryData={`${tableRow.userForename}`}
              />
              <CardEntry
                cardEntryTitle="Surname"
                cardEntryData={`${tableRow.userSurname}`}
              />
              <CardEntry
                cardEntryTitle="Email"
                cardEntryData={`${tableRow.userEmail}`}
              />
              <CardEntry
                cardEntryTitle="Phone Number"
                cardEntryData={`${tableRow.userPhoneNumber}`}
              />
              <CardEntry
                cardEntryTitle="Gender"
                cardEntryData={`${tableRow.userGender}`}
              />
              <CardEntry
                cardEntryTitle="Date Of Birth"
                cardEntryData={`${tableRow.userDateOfBirth
                  .split("-")
                  .reverse()
                  .join("-")}`}
              />
              <CardEntry
                cardEntryTitle="Address"
                cardEntryData={`${tableRow.userAddress}`}
              />

              {entity === "doctor" && (
                <CardEntry
                  cardEntryTitle="Primary Speciality"
                  cardEntryData={`${determineSpecialityOrder(
                    tableRow.medicalSpecialities!,
                    "P"
                  )?.slice(0, -3)}`}
                />
              )}

              {entity === "doctor" && (
                <CardEntry
                  cardEntryTitle="Secondary Speciality"
                  cardEntryData={`${determineSpecialityOrder(
                    tableRow.medicalSpecialities!,
                    "S"
                  )?.slice(0, -3)}`}
                />
              )}

              {entity === "doctor" && (
                <CardEntry
                  cardEntryTitle="Tertiary Speciality"
                  cardEntryData={`${determineSpecialityOrder(
                    tableRow.medicalSpecialities!,
                    "T"
                  )?.slice(0, -3)}`}
                />
              )}

              <div className="p-3 w-full h-10 flex items-center justify-between border-b text-xs">
                <span className="font-semibold">Actions</span>
                <div
                  className={`w-56 flex items-center justify-center text-center space-x-3`}
                >
                  <UpdateUserOverlay user={tableRow} roleName={entity} />
                  <DeleteUserOverlay user={tableRow} roleName={entity} />
                </div>
              </div>
            </div>
          </div>
        ) : isMedicalSpecialityRow(tableRow) ? (
          <div className="h-auto border rounded-xl bg-white shadow-2xl shadow-black/40 text-xs mb-4">
            <div className="w-full flex flex-col">
              <CardEntry
                cardEntryTitle="Medical Speciality Name"
                cardEntryData={`${tableRow.medicalSpecialityName}`}
              />
              <div className="p-3 w-full h-10 flex items-center justify-between border-b text-xs">
                <span className="font-semibold">Actions</span>
                <div
                  className={`w-56 flex items-center justify-center text-center space-x-3`}
                >
                  <UpdateMedicalSpeciality medicalSpeciality={tableRow} />
                  <DeleteMedicalSpecialityOverlay
                    medicalSpeciality={tableRow}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : isAppointmentRow(tableRow) ? (
          <div className="h-auto border rounded-xl bg-white shadow-2xl shadow-black/40 text-xs mb-4">
            <div className="w-full flex flex-col">
              <CardEntry
                cardEntryTitle="Appointment Id"
                cardEntryData={`${tableRow.appointment.appointmentId}`}
              />
              <CardEntry
                cardEntryTitle="Doctor"
                cardEntryData={`${tableRow.doctor.doctorForename} ${tableRow.doctor.doctorSurname}`}
              />
              <CardEntry
                cardEntryTitle="Patient"
                cardEntryData={`${tableRow.patient.patientForename} ${tableRow.patient.patientForename}`}
              />
              <CardEntry
                cardEntryTitle="Appointment Reason"
                cardEntryData={`${tableRow.appointment.appointmentReason}`}
              />
              <CardEntry
                cardEntryTitle="Appointment Date Time"
                cardEntryData={`${tableRow.appointment.appointmentDateTime
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")} ${tableRow.appointment.appointmentDateTime
                  .split("T")[1]
                  .substring(0, 5)}`}
              />
              <CardEntry
                cardEntryTitle="Appointment Status"
                cardEntryData={`${tableRow.appointment.appointmentStatus}`}
                cardEntryType="appointmentStatus"
              />
              <CardEntry
                cardEntryTitle="Appointment Cancellation Reason"
                cardEntryData={`${tableRow.appointment.appointmentCancellationReason}`}
              />
              <div className="p-3 w-full h-10 flex items-center justify-between border-b text-xs">
                <span className="font-semibold">Actions</span>
                <div
                  className={`w-56 flex items-center justify-center text-center space-x-3`}
                >
                  {authenticatedUserDataState.roleNames[0] === "admin" && (
                    <UpdateAppointmentOverlay
                      appointment={tableRow.appointment}
                      doctorData={tableRow.doctor}
                      patientData={tableRow.patient}
                    />
                  )}
                  <DeleteAppointmentOverlay
                    appointmentId={tableRow.appointment.appointmentId}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )
      )}
    </div>
  );
};
