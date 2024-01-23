import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { GeneralTableProps, TableRow, User } from "../../types";
import { CreateUserOverlay } from "../overlays/userOverlays/CreateUserOverlay";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";
import { UpdateUserOverlay } from "../overlays/userOverlays/UpdateUserOverlay";
import { DeleteUserOverlay } from "../overlays/userOverlays/DeleteUserOverlay";

export const GeneralTable: FC<GeneralTableProps> = ({
  URL,
  roleId,
  roleName,
}) => {
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [clickedTableRow, setClickedTableRow] = useState<TableRow>();

  function isUserRow(tableRow: TableRow): tableRow is User {
    return "userId" in tableRow;
  }

  async function fetchTableData() {
    try {
      // http://192.168.2.16:40587/api/users
      const response = await axios.get(URL, {
        params: {
          roleId,
          searchBy: "userForename",
          searchQuery: "",
          limit: 5,
          page: 0,
          orderBy: "asc:userForename",
        },
        withCredentials: true,
      });

      console.log(response.data);
      if (response.data.success)
        setTableRows(response.data.payload.usersRelatedData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);

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
                {roleName === "doctor" && (
                  <td className="px-6 py-4 font-bold">Primary Speciality</td>
                )}
                {roleName === "doctor" && (
                  <td className="px-6 py-4 font-bold">Secondary Speciality</td>
                )}
                {roleName === "doctor" && (
                  <td className="px-6 py-4 font-bold">Tertiary Speciality</td>
                )}
                <td className="px-6 py-4 font-bold">Actions</td>
              </tr>
            ) : (
              ""
            )}
          </thead>
          <tbody>
            {tableRows.map(
              (tableRow: TableRow) =>
                isUserRow(tableRows[0]) && (
                  <tr
                    key={tableRow.userId}
                    className={`border-b border-neutral-400 even:bg-neutral-50 odd:bg-neutral-100 transition duration-300 ease-in-out hover:bg-pink-100 ${
                      clickedTableRow?.userId === tableRow.userId &&
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
                    {roleName === "doctor" && (
                      <td>
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "P"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    {roleName === "doctor" && (
                      <td>
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "S"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    {roleName === "doctor" && (
                      <td>
                        {determineSpecialityOrder(
                          tableRow.medicalSpecialities!,
                          "T"
                        )?.slice(0, -3)}
                      </td>
                    )}
                    <td className="h-14 flex items-center justify-center w-full space-x-2">
                      <UpdateUserOverlay user={tableRow} roleName={roleName} />
                      <DeleteUserOverlay user={tableRow} roleName={roleName} />
                    </td>
                  </tr>
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
        <CreateUserOverlay roleId={roleId} roleName={roleName} />
      </div>
      {/* here notification {JSON.stringify(socketNotificationDataState)} */}
    </div>
  );
};
