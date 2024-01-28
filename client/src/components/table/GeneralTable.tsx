import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import {
  GeneralTableProps,
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
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { UserSearchCriterionPicker } from "../pickers/UserSearchCriterionPicker";
import { StyledInput } from "../design/StyledInput";
import { IoIosSearch } from "react-icons/io";

export const GeneralTable: FC<GeneralTableProps> = ({
  URL,
  entity,
  // roleId,
  // roleName,
}) => {
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [tableTotalCount, setTableTotalCount] = useState<number>(0);
  const [tableTotalPages, setTableTotalPages] = useState<number>(0);
  const [tableLimit, setTableLimit] = useState<number>(10);
  const [clickedTableRow, setClickedTableRow] = useState<TableRow>();
  const [orderBy, setOrderBy] = useState<string>("asc:userForename");
  const [roleId, setRoleId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUserSearchCriteriaName, setSelectedUserSearchCriteriaName] =
    useState<string>("");
  const [selectedUserSearchCriteriaValue, setSelectedUserSearchCriteriaValue] =
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

      console.log("queryParams", queryParams);

      const response = await axios.get(URL, {
        // params: {
        //   roleId,
        //   searchBy: "userForename",
        //   searchQuery: "",
        //   limit: 5,
        //   page: 0,
        //   orderBy: "asc:userForename",
        // },
        params: {
          ...queryParams,
        },
        withCredentials: true,
      });

      console.log("table data ", response.data);
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
  }, [entity, roleId, orderBy, searchQuery, selectedUserSearchCriteriaValue]);

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
    <div className="w-full hidden lg:block border p-4 rounded-xl font-roboto">
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
      <div className="w-full border rounded-xl overflow-hidden">
        {tableRows.length > 0 && (
          <table className="w-full text-center text-xs font-light border rounded-xl">
            <thead className="w-full border-b bg-white font-medium">
              {isUserRow(tableRows[0]) ? (
                <tr>
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
                  <td className="px-6 py-4 font-bold w-1/3">
                    Medical Speciality Id
                  </td>
                  <td className="px-6 py-4 font-bold w-1/3">
                    Medical Speciality Name
                  </td>
                  <td className="px-6 py-4 font-bold w-1/3">Actions</td>
                </tr>
              ) : (
                ""
              )}
            </thead>
            <tbody>
              {tableRows.map((tableRow: TableRow) =>
                isUserRow(tableRow) ? (
                  <tr
                    key={tableRow.userId}
                    className={`border-b border-neutral-400 odd:bg-neutral-100 even:bg-white transition duration-300 ease-in-out hover:bg-pink-100 ${
                      (clickedTableRow as User)?.userId === tableRow.userId &&
                      "!bg-pink-200"
                    }`}
                    onClick={() => setClickedTableRow(tableRow)}
                  >
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
                      {tableRow.userDateOfBirth}
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
                    <td className="">{tableRow.medicalSpecialityId}</td>
                    <td className="">{tableRow.medicalSpecialityName}</td>
                    <td className="h-14 flex items-center justify-center space-x-2">
                      <UpdateMedicalSpeciality medicalSpeciality={tableRow} />
                      <DeleteMedicalSpecialityOverlay
                        medicalSpeciality={tableRow}
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
      </div>
      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
    </div>
  );
};
