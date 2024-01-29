import axios from "axios";
import { FC, useEffect, useState } from "react";
import { User } from "../../types";
import { patientRoleId, userPath } from "../../utils/dotenv";

export const UserPicker: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchTableData() {
    try {
      const response = await axios.get(userPath, {
        params: {
          roleId: patientRoleId,
          searchBy: "userForename",
          searchQuery: "",
          limit: 5,
          page: 0,
          orderBy: "asc:userForename",
        },

        withCredentials: true,
      });

      console.log("USERS data ", response.data);
      if (response.data.success) {
        setUsers(response.data.payload.tableData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);
  return <div></div>;
};
