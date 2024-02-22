import { FC, useContext, useEffect, useRef, useState } from "react";
import {
  UserSearchCriteria,
  UserSearchCriterionPickerProps,
} from "../../types";
import { RiArrowUpSLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { VscDash } from "react-icons/vsc";
import { StyledInputV2 } from "../design/StyledInputV2";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { getItemByLanguageAndCollection } from "../../utils/clientLanguages";

export const UserSearchCriterionPicker: FC<UserSearchCriterionPickerProps> = ({
  entity,
  selectedUserSearchCriteriaName,
  setSelectedUserSearchCriteriaName,
  setSelectedUserSearchCriteriaValue,
  selectedUserSearchCriteriaValue,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
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
        userSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          0
        ),
        userSearchCriteriaValue: "userForename",
      },
      {
        userSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          1
        ),
        userSearchCriteriaValue: "userSurname",
      },
      {
        userSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          2
        ),
        userSearchCriteriaValue: "userEmail",
      },
      {
        userSearchCriteriaName: getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          3
        ),
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserSearchCriterionPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserSearchCriterionPickerVisible]);

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
      selectedUserSearchCriteriaName.toLowerCase() !==
        getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          0
        ).toLowerCase() &&
      selectedUserSearchCriteriaName.toLowerCase() !==
        getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          1
        ).toLowerCase() &&
      selectedUserSearchCriteriaName.toLowerCase() !==
        getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          2
        ).toLowerCase() &&
      selectedUserSearchCriteriaName.toLowerCase() !==
        getItemByLanguageAndCollection(
          authenticatedUserDataState.language.languageCode,
          "searchCriterionUser",
          3
        ).toLowerCase()
    )
      setSelectedUserSearchCriteriaValue("");
    else if (
      selectedUserSearchCriteriaName.toLowerCase() ===
      getItemByLanguageAndCollection(
        authenticatedUserDataState.language.languageCode,
        "searchCriterionUser",
        0
      ).toLowerCase()
    )
      setSelectedUserSearchCriteriaValue("userForename");
    else if (
      selectedUserSearchCriteriaName.toLowerCase() ===
      getItemByLanguageAndCollection(
        authenticatedUserDataState.language.languageCode,
        "searchCriterionUser",
        1
      ).toLowerCase()
    )
      setSelectedUserSearchCriteriaValue("userSurname");
    else if (
      selectedUserSearchCriteriaName.toLowerCase() ===
      getItemByLanguageAndCollection(
        authenticatedUserDataState.language.languageCode,
        "searchCriterionUser",
        2
      ).toLowerCase()
    )
      setSelectedUserSearchCriteriaValue("userEmail");
    else if (
      selectedUserSearchCriteriaName.toLowerCase() ===
      getItemByLanguageAndCollection(
        authenticatedUserDataState.language.languageCode,
        "searchCriterionUser",
        3
      ).toLowerCase()
    )
      setSelectedUserSearchCriteriaValue("userPhoneNumber");
  }, [selectedUserSearchCriteriaName, authenticatedUserDataState]);

  useEffect(() => {
    const foundUserSearchCriteria = userSearchCriterion.find(
      (userSearchCriteria) =>
        userSearchCriteria.userSearchCriteriaName.toLowerCase() ===
        selectedUserSearchCriteriaName.toLowerCase()
    );

    if (foundUserSearchCriteria) {
      setSelectedUserSearchCriteriaValue(
        foundUserSearchCriteria.userSearchCriteriaValue
      );
      setSelectedUserSearchCriteriaName(
        foundUserSearchCriteria.userSearchCriteriaName
      );
    }
  }, [selectedUserSearchCriteriaName, selectedUserSearchCriteriaValue]);

  return (
    <div className="w-full flex">
      <div className="w-full relative z-50" ref={userSearchCriterionPickerRef}>
        {/* <StyledInput
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
          icon={
            // <div>
            //   {isUserSearchCriterionPickerVisible ? (
            //     <RiArrowDownSLine
            //       onClick={(event) => {
            //         event.stopPropagation();
            //         setIsUserSearchCriterionPickerVisible(false);
            //       }}
            //     />
            //   ) : (
            //     <RiArrowUpSLine
            //       onClick={(event) => {
            //         event.stopPropagation();
            //         setIsUserSearchCriterionPickerVisible(true);
            //       }}
            //     />
            //   )}
            // </div>
            <div
              className={`transition-transform transform ${
                !isUserSearchCriterionPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsUserSearchCriterionPickerVisible(
                    !isUserSearchCriterionPickerVisible
                  );
                }}
              />
            </div>
          }
          // <RiFilterLine />
          isPicker={true}
          isPickerVisible={isUserSearchCriterionPickerVisible}
        /> */}
        <StyledInputV2
          unfocusedTextColor={
            selectedUserSearchCriteriaName.length === 0
              ? "text-black"
              : selectedUserSearchCriteriaValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedBorderColor={
            selectedUserSearchCriteriaName.length === 0
              ? "border-black"
              : selectedUserSearchCriteriaValue.length > 0
              ? "border-green-700"
              : "border-red-700"
          }
          focusedTextColor={
            selectedUserSearchCriteriaName.length === 0
              ? "focus:text-pink-500"
              : selectedUserSearchCriteriaValue.length > 0
              ? "focus:text-green-500"
              : "focus:text-red-500"
          }
          focusedBorderColor={
            selectedUserSearchCriteriaName.length === 0
              ? "focus:border-pink-500"
              : selectedUserSearchCriteriaValue.length > 0
              ? "focus:border-green-500"
              : "focus:border-red-500"
          }
          focusedBorderColorIconArea={
            selectedUserSearchCriteriaName.length === 0
              ? "border-pink-500"
              : selectedUserSearchCriteriaValue.length > 0
              ? "border-green-500"
              : "border-red-500"
          }
          unfocusedLabelColor={
            selectedUserSearchCriteriaName.length === 0
              ? "text-black"
              : selectedUserSearchCriteriaValue.length > 0
              ? "text-green-700"
              : "text-red-700"
          }
          unfocusedLabelBackgroundColor="bg-white"
          focusedLabelColor={
            selectedUserSearchCriteriaName.length === 0
              ? "text-pink-500"
              : selectedUserSearchCriteriaValue.length > 0
              ? "text-green-500"
              : "text-red-500"
          }
          focusedLabelBackgroundColor="bg-white"
          icon={
            <div
              className={`transition-transform transform ${
                !isUserSearchCriterionPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsUserSearchCriterionPickerVisible(
                    !isUserSearchCriterionPickerVisible
                  );
                }}
              />
            </div>
          }
          onClickIcon={() =>
            setIsUserSearchCriterionPickerVisible(
              !isUserSearchCriterionPickerVisible
            )
          }
          isDisabled={false}
          // label={`${entity} Criteria`}
          label={
            entity === "patient"
              ? getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "searchCriterion",
                  1
                )
              : entity === "doctor"
              ? getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "searchCriterion",
                  2
                )
              : entity === "receptionist"
              ? getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "searchCriterion",
                  4
                )
              : ""
          }
          name={`${entity}Criteria`}
          onChangeStyledInput={(event) => {
            setSelectedUserSearchCriteriaName(event.target.value);
            setIsUserSearchCriterionPickerVisible(true);
          }}
          onClickInput={() => {
            setIsUserSearchCriterionPickerVisible(
              !isUserSearchCriterionPickerVisible
            );
          }}
          styledInputValue={selectedUserSearchCriteriaName}
          styledInputWidth="w-full"
        />
        <ul
          className={`absolute w-full bg-white dark:bg-darkMode-itemBackgroundColor overflow-y-auto h-40 ${
            isUserSearchCriterionPickerVisible
              ? "opacity-100 duration-500 border border-lightMode-borderColor dark:border-darkMode-borderColor rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {selectedUserSearchCriteriaName === ""
            ? userSearchCriterion.map(
                (userSearchCriteria: UserSearchCriteria) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable cursor-pointer border-b border-lightMode-borderColor dark:border-darkMode-borderColor"
                    key={userSearchCriteria.userSearchCriteriaValue}
                    onClick={() =>
                      handleUserSearchCriteriaClick(userSearchCriteria)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <VscDash />
                        <span>{userSearchCriteria.userSearchCriteriaName}</span>
                      </div>
                      {selectedUserSearchCriteriaName.toLowerCase() ===
                        userSearchCriteria.userSearchCriteriaName.toLowerCase() && (
                        <TiTick />
                      )}
                    </div>
                  </li>
                )
              )
            : filteredUserSearchCriterion.map(
                (filteredUserSearchCriteria: UserSearchCriteria) => (
                  <li
                    className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-lightMode-hoverRowTable hover:dark:bg-darkMode-hoverRowTable cursor-pointer border-b border-lightMode-borderColor dark:border-darkMode-borderColor"
                    key={filteredUserSearchCriteria.userSearchCriteriaValue}
                    onClick={() =>
                      handleUserSearchCriteriaClick(filteredUserSearchCriteria)
                    }
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center">
                        <VscDash />
                        <span>
                          {filteredUserSearchCriteria.userSearchCriteriaName}
                        </span>
                      </div>
                      {selectedUserSearchCriteriaName.toLowerCase() ===
                        filteredUserSearchCriteria.userSearchCriteriaName.toLowerCase() && (
                        <TiTick />
                      )}
                    </div>
                  </li>
                )
              )}
        </ul>
      </div>
    </div>
  );
};
