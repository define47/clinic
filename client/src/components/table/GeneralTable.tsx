import axios from "axios";
import { FC, useEffect } from "react";
import { GeneralTableProps } from "../../types";

export const GeneralTable: FC<GeneralTableProps> = ({ URL, roleId }) => {
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
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  return <div></div>;
};
