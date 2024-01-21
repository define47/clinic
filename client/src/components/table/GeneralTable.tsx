import axios from "axios";
import { FC, useEffect, useState } from "react";
import { GeneralTableProps, TableRow, User } from "../../types";
import { CreateUserOverlay } from "../overlays/userOverlays/CreateUserOverlay";

export const GeneralTable: FC<GeneralTableProps> = ({
  URL,
  roleId,
  roleName,
}) => {
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

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

  return (
    <div>
      {tableRows.length > 0 && (
        <table>
          <thead>
            {isUserRow(tableRows[0]) ? (
              <tr>
                <td>userId</td>
                <td>userForename</td>
                <td>userSurname</td>
                <td>userEmail</td>
                <td>userPhoneNumber</td>
                <td>userGender</td>
                <td>userDateOfBirth</td>
                <td>userAddress</td>
                <td>userRoleName</td>
              </tr>
            ) : (
              ""
            )}
          </thead>
          <tbody>
            {tableRows.map(
              (tableRow: TableRow) =>
                isUserRow(tableRows[0]) && (
                  <tr>
                    <td>{tableRow.userId}</td>
                    <td>{tableRow.userForename}</td>
                    <td>{tableRow.userSurname}</td>
                    <td>{tableRow.userEmail}</td>
                    <td>{tableRow.userPhoneNumber}</td>
                    <td>{tableRow.userGender}</td>
                    <td>{tableRow.userDateOfBirth}</td>
                    <td>{tableRow.userAddress}</td>
                    <td>{tableRow.userRoleName}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      )}

      <div>
        <CreateUserOverlay roleName={roleName} />
      </div>
    </div>
  );
};
