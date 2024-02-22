import {
  ChangeEvent,
  FC,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { UpdateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import axios from "axios";
import { usersPath } from "../../../utils/dotenv";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { MedicalSpecialityPicker } from "../../pickers/MedicalSpecialityPicker";
import { determineSpecialityOrder } from "../../../utils/utils";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { Tooltip } from "../../design/Tooltip";
import { StyledInputV2 } from "../../design/StyledInputV2";
import validator from "validator";
import phone from "phone";
import { GenderPicker } from "../../pickers/GenderPicker";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import {
  getEntityNamesByLanguage,
  getItemByLanguageAndCollection,
} from "../../../utils/clientLanguages";

export const UpdateUserOverlay: FC<UpdateUserOverlayPros> = ({
  user,
  roleName,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [isUpdateUserOverlayVisible, setIsUpdateUserOverlayVisible] =
    useState<boolean>(false);
  const [
    isUpdateUserConfirmationDialogOverlayVisible,
    setIsUpdateUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [userToUpdate, setUserToUpdate] = useState<User>({
    userId: "",
    userForename: "",
    userSurname: "",
    userEmail: "",
    userPhoneNumber: "",
    userGender: "",
    userDateOfBirth: "",
    userAddress: "",
    userEncryptedPassword: "",
    isUserEmailActivated: false,
    isUserApprovedByAdmin: false,
    isUserBanned: false,
    userRoleId: "",
    userRoleName: "",
    medicalSpecialities: [],
  });

  const [
    selectedPrimaryMedicalSpecialityId,
    setSelectedPrimaryMedicalSpecialityId,
  ] = useState<string>("");
  const [
    selectedPrimaryMedicalSpecialityName,
    setSelectedPrimaryMedicalSpecialityName,
  ] = useState<string>("");

  const [
    selectedSecondaryMedicalSpecialityId,
    setSelectedSecondaryMedicalSpecialityId,
  ] = useState<string>("");
  const [
    selectedSecondaryMedicalSpecialityName,
    setSelectedSecondaryMedicalSpecialityName,
  ] = useState<string>("");

  const [
    selectedTertiaryMedicalSpecialityId,
    setSelectedTertiaryMedicalSpecialityId,
  ] = useState<string>("");
  const [
    selectedTertiaryMedicalSpecialityName,
    setSelectedTertiaryMedicalSpecialityName,
  ] = useState<string>("");

  const [selectedGenderValue, setSelectedGenderValue] = useState<string>("");
  const [selectedGenderName, setSelectedGenderName] = useState<string>("");

  const [isUserForenameValid, setIsUserForenameValid] =
    useState<boolean>(false);
  const [isUserSurnameValid, setIsUserSurnameValid] = useState<boolean>(false);
  const [isUserEmailValid, setIsUserEmailValid] = useState<boolean>(false);
  const [isUserPhoneNumberValid, setIsUserPhoneNumberValid] =
    useState<boolean>(false);

  const [userDateOfBirth, setUserDateOfBirth] = useState<string>("");
  const [defaultDate, setDefaultDate] = useState<string>("");
  useEffect(() => {
    const currentDate = new Date();
    if (isUpdateUserOverlayVisible) setDefaultDate(user.userDateOfBirth);
    // setDefaultDate(currentDate.toISOString());
  }, [isUpdateUserOverlayVisible]);

  useEffect(() => {
    if (isUpdateUserOverlayVisible) {
      setUserToUpdate(user);
      setSelectedGenderName(user.userGender);

      if (user.medicalSpecialities) {
        setSelectedPrimaryMedicalSpecialityName(
          determineSpecialityOrder(user.medicalSpecialities, "P").slice(0, -4)!
        );

        if (user.medicalSpecialities.length >= 2) {
          setSelectedSecondaryMedicalSpecialityName(
            determineSpecialityOrder(user.medicalSpecialities, "S").slice(
              0,
              -4
            )!
          );
        }

        if (user.medicalSpecialities.length >= 3) {
          setSelectedTertiaryMedicalSpecialityName(
            determineSpecialityOrder(user.medicalSpecialities, "T").slice(
              0,
              -4
            )!
          );
        }
      }
    }
  }, [user, isUpdateUserOverlayVisible]);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isUpdateUserOverlayVisible === true &&
          isUpdateUserConfirmationDialogOverlayVisible === true
        )
          setIsUpdateUserConfirmationDialogOverlayVisible(false);
        if (
          isUpdateUserOverlayVisible === true &&
          isUpdateUserConfirmationDialogOverlayVisible === false
        )
          setIsUpdateUserOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isUpdateUserOverlayVisible,
    isUpdateUserConfirmationDialogOverlayVisible,
  ]);

  const regex = /^[a-zA-Z \-]*$/;
  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "userForename") {
      setIsUserForenameValid(regex.test(value));
    } else if (name === "userSurname") {
      setIsUserSurnameValid(regex.test(value));
    } else if (name === "userEmail") {
      setIsUserEmailValid(validator.isEmail(value));
    } else if (name === "userPhoneNumber") {
      setIsUserPhoneNumberValid(phone(value).isValid);
    }
    setUserToUpdate((prevUserToUpdate) => ({
      ...prevUserToUpdate,
      [name]: value,
    }));
  }

  useEffect(() => {
    setIsUserForenameValid(regex.test(user.userForename));
    setIsUserSurnameValid(regex.test(user.userSurname));
    setIsUserEmailValid(validator.isEmail(user.userEmail));
  }, [user]);

  async function onUpdateUser() {
    try {
      const specialityIdsToUpdate: string[] = [];

      if (roleName === "doctor") {
        const primarySpeciality = determineSpecialityOrder(
          user.medicalSpecialities!,
          "P"
        )
          ?.slice(0, -3)
          .trim();

        const secondarySpeciality = determineSpecialityOrder(
          user.medicalSpecialities!,
          "S"
        )
          ?.slice(0, -3)
          .trim();

        const tertiarySpeciality = determineSpecialityOrder(
          user.medicalSpecialities!,
          "T"
        )
          ?.slice(0, -3)
          .trim();
        if (
          selectedPrimaryMedicalSpecialityName.trim() !== primarySpeciality &&
          primarySpeciality?.length! > 0
        ) {
          specialityIdsToUpdate.push(
            `primary:${selectedPrimaryMedicalSpecialityId}`
          );
        }

        if (
          selectedSecondaryMedicalSpecialityName.trim() !==
            secondarySpeciality &&
          secondarySpeciality?.length! > 0
        ) {
          specialityIdsToUpdate.push(
            `secondary:${selectedSecondaryMedicalSpecialityId}`
          );
        }

        if (
          selectedTertiaryMedicalSpecialityName.trim() !== tertiarySpeciality &&
          tertiarySpeciality?.length! > 0
        ) {
          specialityIdsToUpdate.push(
            `tertiary:${selectedTertiaryMedicalSpecialityId}`
          );
        }

        // console.log(
        //   "specialityIdsToUpdate",
        //   specialityIdsToUpdate,
        //   "selectedPrimaryMedicalSpecialityName",
        //   selectedPrimaryMedicalSpecialityName,
        //   determineSpecialityOrder(user.medicalSpecialities!, "P")?.slice(
        //     0,
        //     -3
        //   ),
        //   selectedPrimaryMedicalSpecialityName.trim() !==
        //     determineSpecialityOrder(user.medicalSpecialities!, "P")
        //       ?.slice(0, -3)
        //       .trim()
        // );
      }

      const response = await axios.put(
        usersPath,
        {
          userId: user.userId,
          userForename: userToUpdate.userForename,
          userSurname: userToUpdate.userSurname,
          userEmail: userToUpdate.userEmail,
          userPhoneNumber: userToUpdate.userPhoneNumber,
          userGender: selectedGenderValue,
          userDateOfBirth: userDateOfBirth,
          userAddress: userToUpdate.userAddress,
          userEncryptedPassword: "",
          // ...(roleName === "doctor" && {
          //   specialityIds: [
          //     selectedPrimaryMedicalSpecialityId,
          //     selectedSecondaryMedicalSpecialityId,
          //     selectedTertiaryMedicalSpecialityId,
          //   ],
          // }),
          specialityIds: specialityIdsToUpdate,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  //   useEffect(() => {
  //     console.log(isUpdateUserOverlayVisible);
  //   }, [isUpdateUserOverlayVisible]);

  //   const [defaultUserforename, setDefaultUserforename] = useState<string>("");

  //   useEffect(() => {
  //     setDefaultUserforename(user.userForename);
  //   }, [user.userForename, isUpdateUserOverlayVisible]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsUpdateUserOverlayVisible(false);
    }
  };

  return (
    <>
      {isUpdateUserOverlayVisible ? (
        <PiPencilLineFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Update ${roleName}`}>
          <PiPencil
            onClick={() => setIsUpdateUserOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isUpdateUserOverlayVisible ? "visible backdrop-blur-sm" : "invisible"
        }`}
        // closeModal={() => setIsUpdateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-3/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isUpdateUserOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          {/* {JSON.stringify(user)} */}
          {/* {determineSpecialityOrder(user.medicalSpecialities!, "P")?.slice(
            0,
            -3
          )} */}
          <span className="flex justify-center mb-8">Update {roleName}</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              {/* <StyledInput
                label="userForename"
                name="userForename"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                inputValue={userToUpdate.userForename}
                // inputValue=""
              /> */}
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToUpdate.userForename.length === 0
                    ? "text-pink-700"
                    : isUserForenameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToUpdate.userForename.length === 0
                    ? "border-pink-700"
                    : isUserForenameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToUpdate.userForename.length === 0
                    ? "focus:text-pink-500"
                    : isUserForenameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToUpdate.userForename.length === 0
                    ? "focus:border-pink-500"
                    : isUserForenameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToUpdate.userForename.length === 0
                    ? "border-pink-500"
                    : isUserForenameValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToUpdate.userForename.length === 0
                    ? "text-pink-700"
                    : isUserForenameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToUpdate.userForename.length === 0
                    ? "text-pink-500"
                    : isUserForenameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userForename"
                styledInputValue={userToUpdate.userForename}
                onChangeStyledInput={handleStyledInputChange}
                label={`
                ${getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "generalUserTableColumnNames",
                  0
                )} ${getEntityNamesByLanguage(
                  authenticatedUserDataState.language.languageCode,
                  roleName
                )}
                `}
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToUpdate.userSurname.length === 0
                    ? "text-pink-700"
                    : isUserSurnameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToUpdate.userSurname.length === 0
                    ? "border-pink-700"
                    : isUserSurnameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToUpdate.userSurname.length === 0
                    ? "focus:text-pink-500"
                    : isUserSurnameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToUpdate.userSurname.length === 0
                    ? "focus:border-pink-500"
                    : isUserSurnameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToUpdate.userSurname.length === 0
                    ? "border-pink-500"
                    : isUserSurnameValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToUpdate.userSurname.length === 0
                    ? "text-pink-700"
                    : isUserSurnameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToUpdate.userSurname.length === 0
                    ? "text-pink-500"
                    : isUserSurnameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userSurname"
                styledInputValue={userToUpdate.userSurname}
                onChangeStyledInput={handleStyledInputChange}
                label={`
                ${getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "generalUserTableColumnNames",
                  1
                )} ${getEntityNamesByLanguage(
                  authenticatedUserDataState.language.languageCode,
                  roleName
                )}
                `}
              />
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToUpdate.userEmail.length === 0
                    ? "text-pink-700"
                    : isUserEmailValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToUpdate.userEmail.length === 0
                    ? "border-pink-700"
                    : isUserEmailValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToUpdate.userEmail.length === 0
                    ? "focus:text-pink-500"
                    : isUserEmailValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToUpdate.userEmail.length === 0
                    ? "focus:border-pink-500"
                    : isUserEmailValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToUpdate.userEmail.length === 0
                    ? "border-pink-500"
                    : isUserEmailValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToUpdate.userEmail.length === 0
                    ? "text-pink-700"
                    : isUserEmailValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToUpdate.userEmail.length === 0
                    ? "text-pink-500"
                    : isUserEmailValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userEmail"
                styledInputValue={userToUpdate.userEmail}
                onChangeStyledInput={handleStyledInputChange}
                label={`
                ${getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "generalUserTableColumnNames",
                  2
                )} ${getEntityNamesByLanguage(
                  authenticatedUserDataState.language.languageCode,
                  roleName
                )}
                `}
              />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "text-pink-700"
                    : isUserPhoneNumberValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "border-pink-700"
                    : isUserPhoneNumberValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "focus:text-pink-500"
                    : isUserPhoneNumberValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "focus:border-pink-500"
                    : isUserPhoneNumberValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "border-pink-500"
                    : isUserPhoneNumberValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "text-pink-700"
                    : isUserPhoneNumberValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToUpdate.userPhoneNumber.length === 0
                    ? "text-pink-500"
                    : isUserPhoneNumberValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userPhoneNumber"
                styledInputValue={userToUpdate.userPhoneNumber}
                onChangeStyledInput={handleStyledInputChange}
                label={`
                ${getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "generalUserTableColumnNames",
                  3
                )} ${getEntityNamesByLanguage(
                  authenticatedUserDataState.language.languageCode,
                  roleName
                )}
                `}
              />

              {/* <StyledInput
                label="userGender"
                name="userGender"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                inputValue={userToUpdate.userGender}
              /> */}
              <GenderPicker
                setSelectedGenderValue={setSelectedGenderValue}
                selectedGenderValue={selectedGenderValue}
                selectedGenderName={selectedGenderName}
                setSelectedGenderName={setSelectedGenderName}
                z="z-50"
              />
              {/* <StyledInput
                label="userDateOfBirth"
                name="userDateOfBirth"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userDateOfBirth}
              /> */}

              <DateTimePicker
                isDateOnly={true}
                label={"Date of Birth"}
                selectedEntity={userDateOfBirth}
                setSelectedEntity={setUserDateOfBirth}
                defaultDate={defaultDate}
                isOverlayVisible={isUpdateUserOverlayVisible}
                z="z-40"
              />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              {/* <StyledInput
                label="userAddress"
                name="userAddress"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                inputValue={userToUpdate.userAddress}
              /> */}
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToUpdate.userAddress.length > 0
                    ? "text-green-600"
                    : "text-black"
                }
                unfocusedBorderColor={
                  userToUpdate.userAddress.length > 0
                    ? "border-green-700"
                    : "border-black"
                }
                focusedTextColor={
                  userToUpdate.userAddress.length > 0
                    ? "focus:text-green-500"
                    : "focus:text-pink-500"
                }
                focusedBorderColor={
                  userToUpdate.userAddress.length > 0
                    ? "focus:border-green-500"
                    : "focus:border-pink-500"
                }
                focusedBorderColorIconArea={
                  userToUpdate.userAddress.length === 0
                    ? "border-pink-500"
                    : isUserForenameValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToUpdate.userAddress.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToUpdate.userAddress.length > 0
                    ? "text-green-500"
                    : "text-pink-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userAddress"
                styledInputValue={userToUpdate.userAddress}
                onChangeStyledInput={handleStyledInputChange}
                label={`
                ${getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "generalUserTableColumnNames",
                  6
                )} ${getEntityNamesByLanguage(
                  authenticatedUserDataState.language.languageCode,
                  roleName
                )}
                `}
              />
              {roleName === "doctor" && (
                <>
                  <MedicalSpecialityPicker
                    label="primary"
                    selectedMedicalSpecialityId={
                      selectedPrimaryMedicalSpecialityId
                    }
                    setSelectedMedicalSpecialityId={
                      setSelectedPrimaryMedicalSpecialityId
                    }
                    selectedMedicalSpecialityName={
                      selectedPrimaryMedicalSpecialityName
                    }
                    setSelectedMedicalSpecialityName={
                      setSelectedPrimaryMedicalSpecialityName
                    }
                    selectedPrimaryMedicalSpecialityId={
                      selectedPrimaryMedicalSpecialityId
                    }
                    selectedSecondaryMedicalSpecialityId={
                      selectedSecondaryMedicalSpecialityId
                    }
                    selectedTertiaryMedicalSpecialityId={
                      selectedTertiaryMedicalSpecialityId
                    }
                    z="z-50"
                  />
                  {user.medicalSpecialities &&
                    user.medicalSpecialities.length >= 2 && (
                      <MedicalSpecialityPicker
                        label="secondary"
                        selectedMedicalSpecialityId={
                          selectedSecondaryMedicalSpecialityId
                        }
                        setSelectedMedicalSpecialityId={
                          setSelectedSecondaryMedicalSpecialityId
                        }
                        selectedMedicalSpecialityName={
                          selectedSecondaryMedicalSpecialityName
                        }
                        setSelectedMedicalSpecialityName={
                          setSelectedSecondaryMedicalSpecialityName
                        }
                        selectedPrimaryMedicalSpecialityId={
                          selectedPrimaryMedicalSpecialityId
                        }
                        selectedSecondaryMedicalSpecialityId={
                          selectedSecondaryMedicalSpecialityId
                        }
                        selectedTertiaryMedicalSpecialityId={
                          selectedTertiaryMedicalSpecialityId
                        }
                        z="z-40"
                      />
                    )}
                  {user.medicalSpecialities &&
                    user.medicalSpecialities.length >= 3 && (
                      <MedicalSpecialityPicker
                        label="tertiary"
                        selectedMedicalSpecialityId={
                          selectedTertiaryMedicalSpecialityId
                        }
                        setSelectedMedicalSpecialityId={
                          setSelectedTertiaryMedicalSpecialityId
                        }
                        selectedMedicalSpecialityName={
                          selectedTertiaryMedicalSpecialityName
                        }
                        setSelectedMedicalSpecialityName={
                          setSelectedTertiaryMedicalSpecialityName
                        }
                        selectedPrimaryMedicalSpecialityId={
                          selectedPrimaryMedicalSpecialityId
                        }
                        selectedSecondaryMedicalSpecialityId={
                          selectedSecondaryMedicalSpecialityId
                        }
                        selectedTertiaryMedicalSpecialityId={
                          selectedTertiaryMedicalSpecialityId
                        }
                        z="z-30"
                      />
                    )}
                </>
              )}
            </div>
          </div>
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsUpdateUserConfirmationDialogOverlayVisible(true)
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsUpdateUserOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isUpdateUserConfirmationDialogOverlayVisible
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsUpdateUserConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`w-96 h-96 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 rounded-xl flex items-center justify-center transition-all ${
                isUpdateUserConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <StyledRippleButton
                label="Update"
                type="yes"
                onClick={onUpdateUser}
              />
              <StyledRippleButton
                label="Cancel"
                type="delete"
                onClick={() =>
                  setIsUpdateUserConfirmationDialogOverlayVisible(false)
                }
              />
            </div>
          </ConfirmationDialogOverlay>
        </div>
      </Overlay>
    </>
  );
};
