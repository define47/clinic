import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

export const GeneralTable: FC<GeneralTableProps> = ({
  URL,
  entity,
  // roleId,
  // roleName,
}) => {
  const navigate = useNavigate();
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [tableTotalCount, setTableTotalCount] = useState<number>(0);
  const [tableTotalPages, setTableTotalPages] = useState<number>(0);
  const [tableLimit, setTableLimit] = useState<number>(5);
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
          page: 0,
          orderBy,
        };
      else if (entity === "medicalSpeciality")
        queryParams = {
          searchQuery,
          limit: tableLimit,
          page: 0,
        };
      else if (entity === "appointment")
        queryParams = {
          table: selectedTable !== "" ? selectedTable : "doctor",
          searchBy:
            selectedAppointmentCriteriaValue !== ""
              ? selectedAppointmentCriteriaValue
              : "userForename",
          searchQuery,
          scheduleFilter:
            selectedAppointmentPeriodValue === ""
              ? "today"
              : selectedAppointmentPeriodValue,
          orderBy: "desc:userForename, asc:userSurname",
          limit: 100,
          page: 0,
          doctorId: "",
          patientId: "",
        };
      else if (entity === "medicalProcedure") {
        queryParams = {
          medicalSpecialityId: selectedMedicalSpecialityId,
          searchQuery,
          limit: tableLimit,
          page: 0,
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
  ]);

  useEffect(() => {
    console.log(tableRows);
  }, [tableRows]);

  useEffect(() => {
    if (socketNotificationDataState) {
      const receivedSocketData = JSON.parse(socketNotificationDataState);
      const action = receivedSocketData.action;
      let data = receivedSocketData.data;

      if (action === "createMedicalSpeciality") {
        data = data as MedicalSpeciality;
        setTableRows((prevMedicalSpecialities: TableRow[]) => [
          {
            medicalSpecialityId: data.medicalSpecialityId,
            medicalSpecialityName: data.medicalSpecialityName,
          } as MedicalSpeciality,
          ...prevMedicalSpecialities,
        ]);
      } else if (action === "deleteMedicalSpeciality") {
        setTableRows((prevMedicalSpecialities: TableRow[]) =>
          prevMedicalSpecialities.filter((medicalSpeciality: TableRow) => {
            if ("medicalSpecialityId" in medicalSpeciality) {
              return medicalSpeciality.medicalSpecialityId !== data;
            }
            return true;
          })
        );
      } else if (action === "updateMedicalSpeciality") {
        data = data as MedicalSpeciality;
        setTableRows((prevMedicalSpecialities: TableRow[]) => {
          const updatedEvents = prevMedicalSpecialities.map(
            (event: TableRow) => {
              if (
                isMedicalSpecialityRow(event) &&
                event.medicalSpecialityId === data.medicalSpecialityId
              ) {
                return {
                  ...event,
                  medicalSpecialityId: data.medicalSpecialityId,
                  medicalSpecialityName: data.medicalSpecialityName,
                };
              } else {
                return event;
              }
            }
          );
          return updatedEvents;
        });
      }

      console.log(
        "🚀 ~ useEffect ~ socketNotificationDataState:",
        receivedSocketData
      );

      console.log("🚀 ~ useEffect ~ action:", action);

      console.log("receivedSocketData", data);
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
  }, [socketNotificationDataState]);

  function determineSpecialityOrder(
    medicalSpecialities: string[],
    target: string
  ) {
    for (let i = 0; i < medicalSpecialities.length; i++) {
      if (medicalSpecialities[i].includes(target))
        return medicalSpecialities[i];
    }
  }

  return (
    <div className="w-full h-full hidden lg:block border p-4 rounded-xl font-roboto">
      {(entity === "doctor" ||
        entity === "patient" ||
        entity === "receptionist" ||
        entity === "nurse") && (
        <div className="flex space-x-3 mb-3">
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
            <StyledInput
              label={`${entity} search`}
              name="name"
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              icon={<IoIosSearch />}
            />
          )}
        </div>
      )}
      {entity === "medicalSpeciality" && (
        <div className="mb-3">
          <StyledInput
            label={`${entity} search`}
            name="medicalSpecialitySearch"
            onChangeStyledInput={(event) => setSearchQuery(event.target.value)}
            icon={<IoIosSearch />}
          />
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
            selectedAppointmentCriteriaValue={selectedAppointmentCriteriaValue}
            setSelectedAppointmentCriteriaValue={
              setSelectedAppointmentCriteriaValue
            }
          />
          {selectedTable !== "" && selectedAppointmentCriteriaValue !== "" && (
            <StyledInput
              label={`${entity} search`}
              name="appointmentSearch"
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              icon={<IoIosSearch />}
            />
          )}

          <AppointmentPeriodPicker
            selectedAppointmentPeriodValue={selectedAppointmentPeriodValue}
            setSelectedAppointmentPeriodValue={
              setSelectedAppointmentPeriodValue
            }
          />
        </div>
      )}
      {entity === "medicalProcedure" && (
        <div className="flex mb-3">
          <div className="flex-none">
            <StyledInput
              label={`medical procedure search`}
              name="medicalProcedureSearch"
              onChangeStyledInput={(event) =>
                setSearchQuery(event.target.value)
              }
              icon={<IoIosSearch />}
            />
          </div>
          <div className="grow flex justify-center items-center">
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
          <div className="w-72 flex-none"></div>
        </div>
        // <div className="flex ">
        //   <div className="flex-none w-14 h-14 ...">01</div>
        //   <div className="flex justify-center items-center grow bg-red-200 h-14 ...">
        //     02
        //   </div>
        //   <div className="flex-none w-14 h-14 ...">03</div>
        // </div>
      )}
      <div className="w-full border rounded-xl h-4/5 overflow-auto">
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
                    <td>{tableRowIndex}</td>
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
                      <RiTreasureMapLine
                        className="text-xl hover:text-lightMode-sidebarItemIconColor hover:scale-125"
                        onClick={() => {
                          navigate(
                            `/admins/appointment-history/${tableRow.appointment.appointmentId}`
                          );
                          navigate(0);
                        }}
                      />
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
                    <td className="h-14 flex items-center justify-center space-x-2 px-6 py-4 font-medium"></td>
                  </tr>
                ) : (
                  ""
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* <CreateUserOverlay roleName={roleName} /> */}
      {/* <div>
        <button onClick={() => setModalOpen(true)}>Open Modal</button>
        {modalOpen && (
          <CreateUserOverlay
            closeModal={() => setModalOpen(false)}
            roleName={roleName}
          />
        )}
      </div> */}
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
        {entity === "appointment" && <CreateAppointmentOverlay />}
      </div>
      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
    </div>
  );
};
