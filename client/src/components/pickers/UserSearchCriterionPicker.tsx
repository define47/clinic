import { FC, useEffect, useRef, useState } from "react";
import {
  UserSearchCriteria,
  UserSearchCriterionPickerProps,
} from "../../types";
import { StyledInput } from "../design/StyledInput";
import { RiFilterLine } from "react-icons/ri";

export const UserSearchCriterionPicker: FC<UserSearchCriterionPickerProps> = ({
  entity,
  selectedUserSearchCriteriaName,
  setSelectedUserSearchCriteriaName,
  setSelectedUserSearchCriteriaValue,
  selectedUserSearchCriteriaValue,
}) => {
  const [userSearchCriterion, setUserSearchCriterion] = useState<
    UserSearchCriteria[]
  >([]);
  // const [selectedUserSearchCriteriaName, setSelectedUserSearchCriteriaName] =
  //   useState<string>("");
  // const [selectedUserSearchCriteriaValue, setSelectedUserSearchCriteriaValue] =
  //   useState<string>("");
  const [
    isUserSearchCriterionPickerVisible,
    setIsUserSearchCriterionPickerVisible,
  ] = useState<boolean>(false);
  const userSearchCriterionPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUserSearchCriterion([
      {
        userSearchCriteriaName: "Forename",
        userSearchCriteriaValue: "userForename",
      },
      {
        userSearchCriteriaName: "Surname",
        userSearchCriteriaValue: "userSurname",
      },
      {
        userSearchCriteriaName: "Email",
        userSearchCriteriaValue: "userEmail",
      },
      {
        userSearchCriteriaName: "Phone Number",
        userSearchCriteriaValue: "userPhoneNumber",
      },
    ]);
  }, []);

  const filteredUserSearchCriterion = userSearchCriterion.filter(
    (filteredUserSearchCriterion: UserSearchCriteria) =>
      filteredUserSearchCriterion.userSearchCriteriaName
        .toLowerCase()
        .startsWith(selectedUserSearchCriteriaName.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        userSearchCriterionPickerRef.current &&
        !userSearchCriterionPickerRef.current.contains(event.target as Node)
      ) {
        setIsUserSearchCriterionPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  function handleUserSearchCriteriaClick(
    userSearchCriteria: UserSearchCriteria
  ) {
    // setUserSearchCriteriaTerm(userSearchCriteria.userSearchCriteriaName);
    setSelectedUserSearchCriteriaName(
      userSearchCriteria.userSearchCriteriaName
    );
    setSelectedUserSearchCriteriaValue(
      userSearchCriteria.userSearchCriteriaValue
    );
    setIsUserSearchCriterionPickerVisible(false);
  }

  useEffect(() => {
    if (
      selectedUserSearchCriteriaName.length >= 0 &&
      selectedUserSearchCriteriaName.toLowerCase() !== "forename" &&
      selectedUserSearchCriteriaName.toLowerCase() !== "surname" &&
      selectedUserSearchCriteriaName.toLowerCase() !== "email" &&
      selectedUserSearchCriteriaName.toLowerCase() !== "phone number"
    )
      setSelectedUserSearchCriteriaValue("");
    else if (selectedUserSearchCriteriaName.toLowerCase() === "forename")
      setSelectedUserSearchCriteriaValue("userForename");
    else if (selectedUserSearchCriteriaName.toLowerCase() === "surname")
      setSelectedUserSearchCriteriaValue("userSurname");
    else if (selectedUserSearchCriteriaName.toLowerCase() === "email")
      setSelectedUserSearchCriteriaValue("userEmail");
    else if (selectedUserSearchCriteriaName.toLowerCase() === "phone number")
      setSelectedUserSearchCriteriaValue("userPhoneNumber");
  }, [selectedUserSearchCriteriaName]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserSearchCriterionPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserSearchCriterionPickerVisible]);

  useEffect(() => {
    console.log(
      "criteria name:",
      selectedUserSearchCriteriaName,
      "criteria value:",
      selectedUserSearchCriteriaValue
    );
  }, [selectedUserSearchCriteriaName, selectedUserSearchCriteriaValue]);
  return (
    <div className="flex">
      <div className="relative z-50" ref={userSearchCriterionPickerRef}>
        <StyledInput
          label={`${entity} Criteria`}
          inputValue={selectedUserSearchCriteriaName}
          name="userCriteria"
          onChangeStyledInput={(event) => {
            setSelectedUserSearchCriteriaName(event.target.value);
            setIsUserSearchCriterionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsUserSearchCriterionPickerVisible(
              !isUserSearchCriterionPickerVisible
            );
          }}
          icon={<RiFilterLine />}
          isPicker={true}
          isPickerVisible={isUserSearchCriterionPickerVisible}
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto ${
            isUserSearchCriterionPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedUserSearchCriteriaName === ""
            ? userSearchCriterion.map(
                (userSearchCriteria: UserSearchCriteria) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={userSearchCriteria.userSearchCriteriaValue}
                    onClick={() =>
                      handleUserSearchCriteriaClick(userSearchCriteria)
                    }
                  >
                    <span>-</span>
                    <span>{userSearchCriteria.userSearchCriteriaName}</span>
                  </li>
                )
              )
            : filteredUserSearchCriterion.map(
                (filteredUserSearchCriteria: UserSearchCriteria) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
                    key={filteredUserSearchCriteria.userSearchCriteriaValue}
                    onClick={() =>
                      handleUserSearchCriteriaClick(filteredUserSearchCriteria)
                    }
                  >
                    <span>-</span>
                    <span>
                      {filteredUserSearchCriteria.userSearchCriteriaName}
                    </span>
                  </li>
                )
              )}
        </ul>
      </div>
    </div>
  );
};
