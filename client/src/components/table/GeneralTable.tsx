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
  patientRoleId,
  receptionistRoleId,
} from "../../utils/dotenv";
import { CreateMedicalSpecialityOverlay } from "../overlays/medicalSpecialityOverlays/CreateMedicalSpecialityOverlay";
import { DeleteMedicalSpecialityOverlay } from "../overlays/medicalSpecialityOverlays/DeleteMedicalSpecialityOverlay";

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
  const [clickedTableRow, setClickedTableRow] = useState<TableRow>();
  const [roleId, setRoleId] = useState<string>("");

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
          searchBy: "userForename",
          searchQuery: "",
          limit: 5,
          page: 0,
          orderBy: "asc:userForename",
        };
      else if (entity === "medicalSpeciality")
        queryParams = {
          searchQuery: "",
          limit: 5,
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
      if (response.data.success) setTableRows(response.data.payload.tableData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, [entity, roleId]);

  useEffect(() => {
    console.log(tableRows);
  }, [tableRows]);

  // useEffect(() => {
  //   console.log(
  //     "🚀 ~ useEffect ~ socketNotificationDataState:",
  //     socketNotificationDataState
  //   );

  //   setTableRows((prevUsers: TableRow[]) => [
  //     {
  //       userId: "userIdTest",
  //       userForename: "",
  //       userSurname: "",
  //       userEmail: "",
  //       userPhoneNumber: "",
  //       userGender: "",
  //       userDateOfBirth: "",
  //       userAddress: "",
  //       userEncryptedPassword: "",
  //       isUserEmailActivated: false,
  //       isUserApprovedByAdmin: false,
  //       isUserBanned: false,
  //       userRoleId: "",
  //       userRoleName: "",
  //     } as User,
  //     ...prevUsers,
  //   ]);
  // }, [socketNotificationDataState]);

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
    <div>
      {tableRows.length > 0 && (
        <table className="text-center text-xs font-light">
          <thead className="border-b bg-neutral-200 font-medium">
            {isUserRow(tableRows[0]) ? (
              <tr>
                <td className="px-6 py-4 font-bold">userId</td>
                <td className="px-6 py-4 font-bold">userForename</td>
                <td className="px-6 py-4 font-bold">userSurname</td>
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
                  <td className="px-6 py-4 font-bold">Secondary Speciality</td>
                )}
                {entity === "doctor" && (
                  <td className="px-6 py-4 font-bold">Tertiary Speciality</td>
                )}
                <td className="px-6 py-4 font-bold">Actions</td>
              </tr>
            ) : isMedicalSpecialityRow(tableRows[0]) ? (
              <tr>
                <td className="px-6 py-4 font-bold">Medical Speciality Id</td>
                <td className="px-6 py-4 font-bold">Medical Speciality Name</td>
                <td className="px-6 py-4 font-bold">Actions</td>
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
                  className={`border-b border-neutral-400 even:bg-neutral-50 odd:bg-neutral-100 transition duration-300 ease-in-out hover:bg-pink-100 ${
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
                    <td>
                      {determineSpecialityOrder(
                        tableRow.medicalSpecialities!,
                        "P"
                      )?.slice(0, -3)}
                    </td>
                  )}
                  {entity === "doctor" && (
                    <td>
                      {determineSpecialityOrder(
                        tableRow.medicalSpecialities!,
                        "S"
                      )?.slice(0, -3)}
                    </td>
                  )}
                  {entity === "doctor" && (
                    <td>
                      {determineSpecialityOrder(
                        tableRow.medicalSpecialities!,
                        "T"
                      )?.slice(0, -3)}
                    </td>
                  )}
                  <td className="h-14 flex items-center justify-center w-full space-x-2">
                    <UpdateUserOverlay user={tableRow} roleName={entity} />
                    <DeleteUserOverlay user={tableRow} roleName={entity} />
                  </td>
                </tr>
              ) : isMedicalSpecialityRow(tableRow) ? (
                <tr
                  key={tableRow.medicalSpecialityId}
                  className={`border-b border-neutral-400 even:bg-neutral-50 odd:bg-neutral-100 transition duration-300 ease-in-out hover:bg-pink-100 ${
                    (clickedTableRow as MedicalSpeciality)
                      ?.medicalSpecialityId === tableRow.medicalSpecialityId &&
                    "!bg-pink-200"
                  }`}
                  onClick={() => setClickedTableRow(tableRow)}
                >
                  <td>{tableRow.medicalSpecialityId}</td>
                  <td>{tableRow.medicalSpecialityName}</td>
                  <td>
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
      <div>
        {entity === "patient" ||
          entity === "doctor" ||
          (entity === "receptionist" && (
            <CreateUserOverlay roleId={roleId} roleName={entity} />
          ))}
        {entity === "medicalSpeciality" && <CreateMedicalSpecialityOverlay />}
      </div>
      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
    </div>
  );
};
