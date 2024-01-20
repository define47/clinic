import axios from "axios";
import { FC, useEffect, useState } from "react";
import { GeneralTableProps, TableRow, User } from "../../types";

export const GeneralTable: FC<GeneralTableProps> = ({ URL, roleId }) => {
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
      <table>
        <thead>
          {tableRows.length > 0 &&
            (isUserRow(tableRows[0]) ? (
              <tr>
                <td>userId</td>
                <td>userForename</td>
                <td>userSurname</td>
                <td>userEmail</td>
                <td>userPhoneNumber</td>
                <td>userGender</td>
                <td>userDateOfBirth</td>
                <td>userAddress</td>
                <td>roleName</td>
              </tr>
            ) : (
              ""
            ))}
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};
