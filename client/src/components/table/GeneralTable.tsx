import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  AppointmentTableData,
  GeneralTableProps,
  MedicalProcedure,
  MedicalSpeciality,
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
  const [orderBy, setOrderBy] = useState<string>("asc:userForename");
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

  function isUserRow(tableRow: TableRow): tableRow is User {
    return "userId" in tableRow;
  }

  function isMedicalSpecialityRow(
    tableRow: TableRow
  ): tableRow is MedicalSpeciality {
    return "medicalSpecialityId" in tableRow;
  }

  function isAppointmentRow(
    tableRow: TableRow
  ): tableRow is AppointmentTableData {
    return "appointment" in tableRow && "appointmentId" in tableRow.appointment;
  }

  function isMedicalProcedureRow(
    tableRow: TableRow
  ): tableRow is MedicalProcedure {
    return "medicalProcedureId" in tableRow;
  }

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
          orderBy,
        };
      else if (entity === "medicalSpeciality")
        queryParams = {
          searchQuery,
          limit: tableLimit,
          page: currentPage,
        };
      else if (entity === "appointment")
        queryParams = {
          searchInTable: selectedTable !== "" ? selectedTable : "doctor",
          orderInTable: "appointment",
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
          orderBy: "desc:appointmentDateTime",
          limit: tableLimit,
          page: currentPage,
          doctorId: "",
          patientId: "",
        };
      else if (entity === "medicalProcedure") {
        queryParams = {
          medicalSpecialityId: selectedMedicalSpecialityId,
          searchQuery,
          limit: tableLimit,
          page: currentPage,
          orderBy: "asc:medicalProcedureName",
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
    orderBy,
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
        const roles = receivedData.roles as string[];
        const medicalSpecialities =
          receivedData.medicalSpecialities as string[];
        console.log("medicalSpecialities event", medicalSpecialities);

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
        receivedEntity === entity
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
    <div className="w-full bg-white h-full border p-4 rounded-xl font-roboto">
      {/* <button onClick={handlePrint}>print</button> */}
      <div className="flex items-center justify-between">
        {(entity === "doctor" ||
          entity === "patient" ||
          entity === "receptionist" ||
          entity === "nurse") && (
          <div className="flex items-center space-x-3 mb-3">
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
                <div className="relative">
                  <StyledInput
                    label={`${entity} search`}
                    name="appointmentSearch"
                    onChangeStyledInput={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    icon={<IoIosSearch />}
                  />
                </div>
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
      </div>
      <div
        ref={componentRef}
        className="w-full border rounded-xl h-4/5 overflow-auto hidden lg:block"
      >
        {tableRows.length > 0 && (
          <table className="w-full text-center text-xs font-light border rounded-xl">
            <thead className="w-full border-b bg-white font-medium">
              {isUserRow(tableRows[0]) ? (
                <tr>
                  <td>Index</td>
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center justify-center">
                      userId
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center justify-center">
                      userForename
                      {orderBy !== "asc:userForename" && (
                        <RiArrowUpSFill
                          className="text-sm cursor-pointer"
                          onClick={() => setOrderBy("asc:userForename")}
                        />
                      )}
                      {orderBy === "asc:userForename" && (
                        <RiArrowDownSFill
                          className="text-sm cursor-pointer"
                          onClick={() => setOrderBy("desc:userForename")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <div className="flex items-center justify-center">
                      userSurname
                      {orderBy !== "asc:userSurname" && (
                        <RiArrowUpSFill
                          className="text-sm cursor-pointer"
                          onClick={() => setOrderBy("asc:userSurname")}
                        />
                      )}
                      {orderBy === "asc:userSurname" && (
                        <RiArrowDownSFill
                          className="text-sm cursor-pointer"
                          onClick={() => setOrderBy("desc:userSurname")}
                        />
                      )}
                      {/* {orderBy === "asc:userSurname" ? (
                      
                    ) : orderBy === "desc:userForename" ? (
                      <RiArrowDownSFill
                        onClick={() => setOrderBy("asc:userSurname")}
                      />
                    ) : (
                      ""
                    )} */}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">userEmail</td>
                  <td className="px-6 py-4 font-bold">userPhoneNumber</td>
                  <td className="px-6 py-4 font-bold">userGender</td>
                  <td className="px-6 py-4 font-bold">userDateOfBirth</td>
                  <td className="px-6 py-4 font-bold">userAddress</td>
                  <td className="px-6 py-4 font-bold">userRoleName</td>
                  {entity === "doctor" && (
                    <td className="px-6 py-4 font-bold">Primary Speciality</td>
                  )}
                  {entity === "doctor" && (
                    <td className="px-6 py-4 font-bold">
                      Secondary Speciality
                    </td>
                  )}
                  {entity === "doctor" && (
                    <td className="px-6 py-4 font-bold">Tertiary Speciality</td>
                  )}
                  <td className="px-6 py-4 font-bold">Actions</td>
                </tr>
              ) : isMedicalSpecialityRow(tableRows[0]) ? (
                <tr>
                  <td>Index</td>
                  <td className="px-6 py-4 font-bold w-1/3">
                    Medical Speciality Id
                  </td>
                  <td className="px-6 py-4 font-bold w-1/3">
                    Medical Speciality Name
                  </td>
                  <td className="px-6 py-4 font-bold w-1/3">Actions</td>
                </tr>
              ) : isAppointmentRow(tableRows[0]) ? (
                <tr>
                  <td>Index</td>
                  <td className="px-6 py-4 font-bold">appointmentId</td>
                  <td className="px-6 py-4 font-bold">doctor</td>
                  <td className="px-6 py-4 font-bold">patient</td>
                  <td className="px-6 py-4 font-bold">appointmentReason</td>
                  <td className="px-6 py-4 font-bold">appointmentDateTime</td>
                  <td className="px-6 py-4 font-bold">appointmentStatus</td>
                  <td className="px-6 py-4 font-bold">
                    appointmentCancellationReason
                  </td>
                  <td className="px-6 py-4 font-bold">Actions</td>
                </tr>
              ) : isMedicalProcedureRow(tableRows[0]) ? (
                <tr>
                  <td>Index</td>
                  <td className="px-6 py-4 font-bold">medicalProcedureId</td>
                  <td className="px-6 py-4 font-bold">medicalProcedureName</td>
                  <td className="px-6 py-4 font-bold">medicalProcedurePrice</td>
                  <td className="px-6 py-4 font-bold">Actions</td>
                </tr>
              ) : (
                ""
              )}
            </thead>
            <tbody>
              {tableRows.map((tableRow: TableRow, tableRowIndex: number) =>
                isUserRow(tableRow) ? (
                  <tr
                    key={tableRow.userId}
                    className={`border-b border-neutral-400 odd:bg-neutral-100 even:bg-white transition duration-300 ease-in-out hover:bg-pink-100 ${
                      (clickedTableRow as User)?.userId === tableRow.userId &&
                      "!bg-pink-200"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
                    <td>{tableRowIndex + 1 + currentPage * 5}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {tableRow.userId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userForename}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userSurname}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userEmail}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userPhoneNumber}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userGender}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userDateOfBirth.split("-").reverse().join("-")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userAddress}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.userRoleName}
                    </td>
                    {entity === "doctor" && (
                      <td className="px-6 py-4 font-medium">
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "P"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    {entity === "doctor" && (
                      <td className="px-6 py-4 font-medium">
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "S"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    {entity === "doctor" && (
                      <td className="px-6 py-4 font-medium">
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "T"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    <td className="h-14 flex items-center justify-center space-x-2">
                      <UpdateUserOverlay user={tableRow} roleName={entity} />
                      <DeleteUserOverlay user={tableRow} roleName={entity} />
                    </td>
                  </tr>
                ) : isMedicalSpecialityRow(tableRow) ? (
                  <tr
                    key={tableRow.medicalSpecialityId}
                    className={`border-b border-neutral-400 odd:bg-neutral-100 even:bg-white transition duration-300 ease-in-out hover:bg-pink-100 ${
                      (clickedTableRow as MedicalSpeciality)
                        ?.medicalSpecialityId ===
                        tableRow.medicalSpecialityId && "!bg-pink-200"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
                    <td>{tableRowIndex}</td>
                    <td className="">{tableRow.medicalSpecialityId}</td>
                    <td className="">{tableRow.medicalSpecialityName}</td>
                    <td className="h-14 flex items-center justify-center space-x-2">
                      <UpdateMedicalSpeciality medicalSpeciality={tableRow} />
                      <DeleteMedicalSpecialityOverlay
                        medicalSpeciality={tableRow}
                      />
                    </td>
                  </tr>
                ) : isAppointmentRow(tableRow) ? (
                  <tr
                    key={tableRow.appointment.appointmentId}
                    className={`border-b border-neutral-400 odd:bg-neutral-100 even:bg-white transition duration-300 ease-in-out hover:bg-pink-100 ${
                      (clickedTableRow as AppointmentTableData)?.appointment
                        .appointmentId === tableRow.appointment.appointmentId &&
                      "!bg-pink-200"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
                    <td>{tableRowIndex}</td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.appointment.appointmentId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.doctor.doctorForename}&nbsp;
                      {tableRow.doctor.doctorSurname}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.patient.patientForename}&nbsp;
                      {tableRow.patient.patientSurname}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.appointment.appointmentReason}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.appointment.appointmentDateTime
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                      &nbsp;
                      {tableRow.appointment.appointmentDateTime
                        .split("T")[1]
                        .substring(0, 5)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.appointment.appointmentStatus}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.appointment.appointmentCancellationReason}
                    </td>
                    <td className="h-14 flex items-center justify-center space-x-2">
                      <UpdateAppointmentOverlay
                        appointment={tableRow.appointment}
                        doctorData={tableRow.doctor}
                        patientData={tableRow.patient}
                      />

                      <DeleteAppointmentOverlay
                        appointmentId={tableRow.appointment.appointmentId}
                      />
                      {authenticatedUserDataState.roleNames[0] === "doctor" &&
                        authenticatedUserDataState.roleNames[1] ===
                          "doctor" && (
                          <CreateMedicalRecordPatientOverlay
                            appointment={tableRow}
                          />
                        )}

                      <Tooltip text="View Appointment History">
                        <RiTreasureMapLine
                          className="text-xl hover:text-lightMode-sidebarItemIconColor hover:scale-125 cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/admins/appointment-history/${tableRow.appointment.appointmentId}`
                            );
                            navigate(0);
                          }}
                        />
                      </Tooltip>
                    </td>
                  </tr>
                ) : isMedicalProcedureRow(tableRow) ? (
                  <tr
                    key={tableRow.medicalProcedureId}
                    className={`border-b border-neutral-400 odd:bg-neutral-100 even:bg-white transition duration-300 ease-in-out hover:bg-pink-100 ${
                      (clickedTableRow as MedicalProcedure)
                        ?.medicalProcedureId === tableRow.medicalProcedureId &&
                      "!bg-pink-200"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
                    <td>{tableRowIndex}</td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.medicalProcedureId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.medicalProcedureName}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tableRow.medicalProcedurePrice}
                    </td>
                    <td className="h-14 flex items-center justify-center space-x-2 px-6 py-4 font-medium">
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
        <StyledRippleButton
          label={`Previous Page`}
          type="create"
          onClick={() => {
            if (currentPage > 0) setCurrentPage(currentPage - 1);
          }}
        />
        {currentPage + 1}
        <StyledRippleButton
          label={`Next Page`}
          type="create"
          onClick={() => {
            if (currentPage < tableTotalPages) setCurrentPage(currentPage + 1);
          }}
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <span>total count: {tableTotalCount}</span>
        <span>total pages: {tableTotalPages}</span>
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

      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
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
                  <UpdateAppointmentOverlay
                    appointment={tableRow.appointment}
                    doctorData={tableRow.doctor}
                    patientData={tableRow.patient}
                  />

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
