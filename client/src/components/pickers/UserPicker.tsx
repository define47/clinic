import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { User, UserPickerProps } from "../../types";
import { doctorRoleId, patientRoleId, usersPath } from "../../utils/dotenv";
import { StyledInput } from "../design/StyledInput";
import { TiTick } from "react-icons/ti";
import { RiArrowUpSLine } from "react-icons/ri";
import { VscDash } from "react-icons/vsc";

export const UserPicker: FC<UserPickerProps> = ({
  label,
  roleName,
  selectedUserId,
  setSelectedUserId,
  selectedUserName,
  setSelectedUserName,
  disabled,
  z,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  // const [selectedUserId, setSelectedUserId] = useState<string>("");
  // const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [isUserPickerVisible, setIsUserPickerVisible] =
    useState<boolean>(false);
  const userSearchPickerRef = useRef<HTMLDivElement | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        userSearchPickerRef.current &&
        !userSearchPickerRef.current.contains(event.target as Node)
      ) {
        setIsUserPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserPickerVisible]);

  async function fetchTableData() {
    try {
      const response = await axios.get(usersPath, {
        params: {
          roleId:
            roleName === "patient"
              ? patientRoleId
              : roleName === "doctor"
              ? doctorRoleId
              : "",
          searchBy: "userForename",
          searchQuery: "",
          limit: 5,
          page: 0,
          orderBy: "asc:userForename",
        },

        withCredentials: true,
      });

      // console.log("USERS data ", response.data);
      if (response.data.success) setUsers(response.data.payload.tableData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    console.log("USERS data ", users);
  }, [users]);

  function filterUsers() {
    // const filteredUsers = users.filter((filteredUser: User) =>
    //   filteredUser.userForename
    //     .toLowerCase()
    //     .startsWith(selectedUserName.toLowerCase())
    // );

    const filteredUsers = users.filter((filteredUser: User) => {
      const userForenameMatch = filteredUser.userForename
        .toLowerCase()
        .startsWith(selectedUserName);
      const userSurnameMatch = filteredUser.userSurname
        .toLowerCase()
        .startsWith(selectedUserName);
      // const specialityName = filteredUser
      //   .medicalSpecialities![0]?.toLowerCase()
      //   .startsWith(selectedUserName);
      let specialityNameMatch = false;

      if (roleName === "doctor" && filteredUser.medicalSpecialities) {
        for (let i = 0; i < filteredUser.medicalSpecialities.length; i++) {
          const speciality = filteredUser.medicalSpecialities[i]?.toLowerCase();
          if (
            speciality &&
            speciality.startsWith(selectedUserName.toLowerCase())
          ) {
            specialityNameMatch = true;
            break; // Break the loop if a match is found
          }
        }
      }

      const fullName =
        `${filteredUser.userForename} ${filteredUser.userSurname}`.toLowerCase();
      const fullNameMatch = fullName.startsWith(selectedUserName);
      return (
        userForenameMatch ||
        userSurnameMatch ||
        fullNameMatch ||
        (roleName === "doctor" && specialityNameMatch)
      );
    });

    return filteredUsers;
  }

  useEffect(() => {
    setFilteredUsers(filterUsers());
  }, [selectedUserName]);

  function handleUserClick(user: User) {
    setSelectedUserId(user.userId);

    if (roleName === "patient")
      setSelectedUserName(`${user.userForename} ${user.userSurname}`);
    else if (roleName === "doctor")
      setSelectedUserName(`${user.userForename} ${user.userSurname} (
        ${roleName === "doctor" && user.medicalSpecialities})`);

    setIsUserPickerVisible(false);
  }

  useEffect(() => {
    console.log(
      "selectedUserId",
      selectedUserId,
      "selectedUserName",
      selectedUserName
    );
  }, [selectedUserName, selectedUserId]);

  useEffect(() => {
    for (let i = 0; i < filteredUsers.length; i++) {
      if (
        selectedUserName.toLowerCase() !==
        `${filteredUsers[i].userForename.toLowerCase()} ${filteredUsers[
          i
        ].userSurname.toLowerCase()}`
      ) {
        setSelectedUserId("");
      } else if (
        selectedUserName.toLowerCase() ===
        `${filteredUsers[i].userForename.toLowerCase()} ${filteredUsers[
          i
        ].userSurname.toLowerCase()}`
      ) {
        setSelectedUserId(filteredUsers[i].userId);
        break;
      }
    }
  }, [filteredUsers, selectedUserName]);

  return (
    <div className="flex">
      <div className={`relative ${z}`} ref={userSearchPickerRef}>
        <StyledInput
          label={label}
          inputValue={selectedUserName}
          name="userCriteria"
          onChangeStyledInput={(event) => {
            setSelectedUserName(event.target.value);
            setIsUserPickerVisible(true);
          }}
          onClickInput={() => {
            setIsUserPickerVisible(!isUserPickerVisible);
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isUserPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  // setIsUserPickerVisible(!isUserPickerVisible);
                }}
              />
            </div>
          }
          isPicker={true}
          isPickerVisible={isUserPickerVisible}
          disabled={disabled}
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isUserPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedUserName === ""
            ? users.map((user: User) => (
                <li
                  className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={user.userId}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <VscDash />
                      <span>{user.userForename}</span>&nbsp;
                      <span>{user.userSurname}</span>&nbsp;
                      {roleName === "doctor" &&
                        "(" + user.medicalSpecialities + ")"}
                      {/* {roleName === "doctor" &&
                        user.medicalSpecialities &&
                        "(" +
                          user.medicalSpecialities.map(
                            (
                              medicalSpeciality: string,
                              medicalSpecialityIndex: number
                            ) =>
                              medicalSpecialityIndex !==
                                user.medicalSpecialities?.length && (
                                <span>{medicalSpeciality},&nbsp;</span>
                              )
                          )} */}
                    </div>
                    {selectedUserName.toLowerCase() ===
                      `${user.userForename.toLowerCase()} ${user.userSurname.toLowerCase()}` && (
                      <TiTick />
                    )}
                  </div>
                </li>
              ))
            : filteredUsers.map((filteredUser: User) => (
                <li
                  className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                  key={filteredUser.userId}
                  onClick={() => handleUserClick(filteredUser)}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center">
                      <VscDash />
                      <span>{filteredUser.userForename}</span>&nbsp;
                      <span>{filteredUser.userSurname}</span>&nbsp;
                      {roleName === "doctor" &&
                        "(" + filteredUser.medicalSpecialities + ")"}
                    </div>
                    {selectedUserName.toLowerCase() ===
                      `${filteredUser.userForename.toLowerCase()} ${filteredUser.userSurname.toLowerCase()}` && (
                      <TiTick />
                    )}
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};
