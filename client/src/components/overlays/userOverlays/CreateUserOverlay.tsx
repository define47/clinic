import {
  ChangeEvent,
  FC,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { CreateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import axios from "axios";
import { usersPath } from "../../../utils/dotenv";
import { MedicalSpecialityPicker } from "../../pickers/MedicalSpecialityPicker";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { StyledEntry } from "../../design/StyledEntry";
import validator from "validator";
import { StyledInputV2 } from "../../design/StyledInputV2";
import phone from "phone";
import { GenderPicker } from "../../pickers/GenderPicker";
import { AuthenticatedUserDataContext } from "../../../contexts/UserContext";
import {
  getEntityNamesByLanguage,
  getItemByLanguageAndCollection,
} from "../../../utils/clientLanguages";
import { toast } from "sonner";

export const CreateUserOverlay: FC<CreateUserOverlayPros> = ({
  roleId,
  roleName,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [isCreateUserOverlayVisible, setIsCreateUserOverlayVisible] =
    useState<boolean>(false);
  const [
    isCreateUserConfirmationDialogOverlayVisible,
    setIsCreateUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [userToCreate, setUserToCreate] = useState<User>({
    userId: "",
    userForename: "patientFN",
    userSurname: "patientLN",
    userEmail: "patientEM@gmail.com",
    userPhoneNumber: "patientPH",
    userGender: "male",
    userDateOfBirth: "1780-01-01",
    userAddress: "patientAddr",
    userEncryptedPassword: "",
    isUserEmailActivated: false,
    isUserApprovedByAdmin: false,
    isUserBanned: false,
    userRoleId: "",
    userRoleName: "",
  });
  const [userDateOfBirth, setUserDateOfBirth] = useState<string>("");

  const [defaultDate, setDefaultDate] = useState<string>("");
  useEffect(() => {
    const currentDate = new Date();
    if (isCreateUserOverlayVisible) setDefaultDate("1980-01-01");
    // setDefaultDate(currentDate.toISOString());
  }, [isCreateUserOverlayVisible]);

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
  const [isUserGenderValid, setIsUserGenderValid] = useState<boolean>(false);
  const [isUserAddressValid, setIsUserAddressValid] = useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (
          isCreateUserOverlayVisible === true &&
          isCreateUserConfirmationDialogOverlayVisible === true
        )
          setIsCreateUserConfirmationDialogOverlayVisible(false);
        if (
          isCreateUserOverlayVisible === true &&
          isCreateUserConfirmationDialogOverlayVisible === false
        )
          setIsCreateUserOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [
    isCreateUserOverlayVisible,
    isCreateUserConfirmationDialogOverlayVisible,
  ]);

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    const regex = /^[a-zA-Z \-]*$/;
    if (name === "userForename") {
      setIsUserForenameValid(regex.test(value));
      // if (regex.test(value))
      //   setUserToCreate((prevUserToCreate) => ({
      //     ...prevUserToCreate,
      //     userForename: value,
      //   }));
    } else if (name === "userSurname") {
      setIsUserSurnameValid(regex.test(value));
    } else if (name === "userEmail") {
      setIsUserEmailValid(validator.isEmail(value));
    } else if (name === "userPhoneNumber") {
      setIsUserPhoneNumberValid(phone("+40" + value).isValid);
    } else if (name === "userGender") {
      setIsUserGenderValid(regex.test(value));
    }

    setUserToCreate((prevUserToCreate) => ({
      ...prevUserToCreate,
      [name]: value,
    }));
  }

  useEffect(() => {
    console.log("isUserForenameValid", isUserForenameValid);
    console.log("isUserEmailValid", isUserEmailValid);
  }, [isUserEmailValid, isUserForenameValid]);

  async function onCreateUser() {
    try {
      const response = await axios.post(
        usersPath,
        {
          userForename: userToCreate.userForename,
          userSurname: userToCreate.userSurname,
          userEmail: userToCreate.userEmail,
          userPhoneNumber: userToCreate.userPhoneNumber,
          userGender: selectedGenderValue,
          // userDateOfBirth: userToCreate.userDateOfBirth,
          userDateOfBirth,
          userAddress: userToCreate.userAddress,
          userEncryptedPassword: "",
          roleIds: [roleId],
          ...(roleName === "doctor" && {
            specialityIds: [
              selectedPrimaryMedicalSpecialityId,
              selectedSecondaryMedicalSpecialityId,
              selectedTertiaryMedicalSpecialityId,
            ],
          }),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsCreateUserConfirmationDialogOverlayVisible(false);
        setIsCreateUserOverlayVisible(false);
        toast.success("Created User Successfully");
      } else {
        toast.error("NOT Created User Successfully");
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsCreateUserOverlayVisible(false);
    }
  };

  useEffect(() => {
    console.log(userToCreate);
  }, [userToCreate]);

  return (
    <>
      <StyledRippleButton
        label={`Create ${roleName}`}
        type="create"
        onClick={() => setIsCreateUserOverlayVisible(true)}
      />

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isCreateUserOverlayVisible ? "visible" : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-3/4 lg:h-1/2 rounded-xl shadow p-6 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 transition-all ${
            isCreateUserOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create {roleName}</span>
          <div className="w-full lg:flex lg:justify-between lg:space-x-24">
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToCreate.userForename.length === 0
                    ? "text-black"
                    : isUserForenameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToCreate.userForename.length === 0
                    ? "border-black"
                    : isUserForenameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToCreate.userForename.length === 0
                    ? "focus:text-pink-500"
                    : isUserForenameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToCreate.userForename.length === 0
                    ? "focus:border-pink-500"
                    : isUserForenameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToCreate.userForename.length === 0
                    ? "border-pink-500"
                    : isUserForenameValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userForename.length === 0
                    ? "text-black"
                    : isUserForenameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userForename.length === 0
                    ? "text-pink-500"
                    : isUserForenameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userForename"
                styledInputValue={userToCreate.userForename}
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
                  userToCreate.userSurname.length === 0
                    ? "text-black"
                    : isUserSurnameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToCreate.userSurname.length === 0
                    ? "border-black"
                    : isUserSurnameValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToCreate.userSurname.length === 0
                    ? "focus:text-pink-500"
                    : isUserSurnameValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToCreate.userSurname.length === 0
                    ? "focus:border-pink-500"
                    : isUserSurnameValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToCreate.userSurname.length === 0
                    ? "border-pink-500"
                    : isUserSurnameValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userSurname.length === 0
                    ? "text-black"
                    : isUserSurnameValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userSurname.length === 0
                    ? "text-pink-500"
                    : isUserSurnameValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userSurname"
                styledInputValue={userToCreate.userSurname}
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
                  userToCreate.userEmail.length === 0
                    ? "text-black"
                    : isUserEmailValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToCreate.userEmail.length === 0
                    ? "border-black"
                    : isUserEmailValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToCreate.userEmail.length === 0
                    ? "focus:text-pink-500"
                    : isUserEmailValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToCreate.userEmail.length === 0
                    ? "focus:border-pink-500"
                    : isUserEmailValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToCreate.userEmail.length === 0
                    ? "border-pink-500"
                    : isUserEmailValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userEmail.length === 0
                    ? "text-black"
                    : isUserEmailValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userEmail.length === 0
                    ? "text-pink-500"
                    : isUserEmailValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userEmail"
                styledInputValue={userToCreate.userEmail}
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
                  userToCreate.userPhoneNumber.length === 0
                    ? "text-black"
                    : isUserPhoneNumberValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToCreate.userPhoneNumber.length === 0
                    ? "border-black"
                    : isUserPhoneNumberValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToCreate.userPhoneNumber.length === 0
                    ? "focus:text-pink-500"
                    : isUserPhoneNumberValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToCreate.userPhoneNumber.length === 0
                    ? "focus:border-pink-500"
                    : isUserPhoneNumberValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                focusedBorderColorIconArea={
                  userToCreate.userPhoneNumber.length === 0
                    ? "border-pink-500"
                    : isUserPhoneNumberValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userPhoneNumber.length === 0
                    ? "text-black"
                    : isUserPhoneNumberValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userPhoneNumber.length === 0
                    ? "text-pink-500"
                    : isUserPhoneNumberValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userPhoneNumber"
                styledInputValue={userToCreate.userPhoneNumber}
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
              {/* <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToCreate.userGender.length === 0
                    ? "text-black"
                    : isUserGenderValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedBorderColor={
                  userToCreate.userGender.length === 0
                    ? "border-black"
                    : isUserGenderValid
                    ? "border-green-700"
                    : "border-red-700"
                }
                focusedTextColor={
                  userToCreate.userGender.length === 0
                    ? "focus:text-pink-500"
                    : isUserGenderValid
                    ? "focus:text-green-500"
                    : "focus:text-red-500"
                }
                focusedBorderColor={
                  userToCreate.userGender.length === 0
                    ? "focus:border-pink-500"
                    : isUserGenderValid
                    ? "focus:border-green-500"
                    : "focus:border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userGender.length === 0
                    ? "text-black"
                    : isUserGenderValid
                    ? "text-green-700"
                    : "text-red-700"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userGender.length === 0
                    ? "text-pink-500"
                    : isUserGenderValid
                    ? "text-green-500"
                    : "text-red-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userGender"
                styledInputValue={userToCreate.userGender}
                onChangeStyledInput={handleStyledInputChange}
                label="Gender"
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
                defaultValue="1765-05-23"
              /> */}

              <DateTimePicker
                isDateOnly={true}
                label={"Date of Birth"}
                selectedEntity={userDateOfBirth}
                setSelectedEntity={setUserDateOfBirth}
                defaultDate={defaultDate}
                isOverlayVisible={isCreateUserOverlayVisible}
                z="z-40"
              />
            </div>
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline space-y-6">
              <StyledInputV2
                styledInputWidth="w-full"
                unfocusedTextColor={
                  userToCreate.userAddress.length > 0
                    ? "text-green-600"
                    : "text-black"
                }
                unfocusedBorderColor={
                  userToCreate.userAddress.length > 0
                    ? "border-green-700"
                    : "border-black"
                }
                focusedTextColor={
                  userToCreate.userAddress.length > 0
                    ? "focus:text-green-500"
                    : "focus:text-pink-500"
                }
                focusedBorderColor={
                  userToCreate.userAddress.length > 0
                    ? "focus:border-green-500"
                    : "focus:border-pink-500"
                }
                focusedBorderColorIconArea={
                  userToCreate.userAddress.length === 0
                    ? "border-pink-500"
                    : isUserAddressValid
                    ? "border-green-500"
                    : "border-red-500"
                }
                unfocusedLabelColor={
                  userToCreate.userAddress.length > 0
                    ? "text-green-700"
                    : "text-black"
                }
                unfocusedLabelBackgroundColor="bg-white"
                focusedLabelColor={
                  userToCreate.userAddress.length > 0
                    ? "text-green-500"
                    : "text-pink-500"
                }
                focusedLabelBackgroundColor="bg-white"
                isDisabled={false}
                name="userAddress"
                styledInputValue={userToCreate.userAddress}
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
                    label={getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "medicalSpecialityPickerLabels",
                      1
                    )}
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
                    z={"z-30"}
                  />

                  <MedicalSpecialityPicker
                    label={getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "medicalSpecialityPickerLabels",
                      2
                    )}
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
                    z={"z-20"}
                  />

                  <MedicalSpecialityPicker
                    label={getItemByLanguageAndCollection(
                      authenticatedUserDataState.language.languageCode,
                      "medicalSpecialityPickerLabels",
                      3
                    )}
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
                    z={"z-10"}
                  />
                </>
              )}
            </div>
          </div>
          <div className="w-full mt-14 flex items-center justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsCreateUserConfirmationDialogOverlayVisible(true)
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsCreateUserOverlayVisible(false)}
            />
          </div>

          <ConfirmationDialogOverlay
            className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
              isCreateUserConfirmationDialogOverlayVisible
                ? "visible"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsCreateUserConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`lg:w-2/3 lg:h-1/3 p-4 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 flex flex-col rounded-xl transition-all ${
                isCreateUserConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <span className="w-full flex text-center items-center justify-center text-xl font-bold mb-5">
                  Are You Sure You Want To Create The {roleName}?
                </span>
                <div className="w-full lg:flex lg:justify-between lg:space-x-24">
                  <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline">
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="userForename"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={userToCreate.userForename}
                    />
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="userSurname"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={userToCreate.userSurname}
                    />
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="userEmail"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={userToCreate.userEmail}
                    />
                  </div>
                  <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline  ">
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="Phone Number"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={userToCreate.userPhoneNumber}
                    />
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="userGender"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={selectedGenderValue}
                    />
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-3/12"
                      confirmationDialogEntryTitle="userEmail"
                      confirmationDialogEntryBodyWidth="w-8/12"
                      confirmationDialogEntryBody={userToCreate.userDateOfBirth
                        .split("-")
                        .reverse()
                        .join("-")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-baseline  ">
                    <StyledEntry
                      entryHeight="h-8"
                      entryWidth="w-11/12"
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userAddress"
                      confirmationDialogEntryBodyWidth="w-9/12"
                      confirmationDialogEntryBody={userToCreate.userAddress}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between mt-5">
                <StyledRippleButton
                  label="Create"
                  type="yes"
                  onClick={onCreateUser}
                />
                <StyledRippleButton
                  label="Cancel"
                  type="delete"
                  onClick={() =>
                    setIsCreateUserConfirmationDialogOverlayVisible(false)
                  }
                />
              </div>
            </div>
          </ConfirmationDialogOverlay>
        </div>
      </Overlay>
    </>
  );
};

// import { ChangeEvent, FC, useEffect, useState } from "react";
// import { CreateUserOverlayPros, User } from "../../../types";
// import { StyledInput } from "../../design/StyledInput";

// export const CreateUserOverlay: FC<CreateUserOverlayPros> = ({ roleName }) => {
//   const [isCreateUserOverlayVisible, setIsCreateUserOverlayVisible] =
//     useState<boolean>(false);
//   const [userToCreate, setUserToCreate] = useState<User>({
//     userId: "",
//     userForename: "",
//     userSurname: "",
//     userEmail: "",
//     userPhoneNumber: "",
//     userGender: "",
//     userDateOfBirth: "",
//     userAddress: "",
//     userEncryptedPassword: "",
//     isUserEmailActivated: false,
//     isUserApprovedByAdmin: false,
//     isUserBanned: false,
//     userRoleId: "",
//     userRoleName: "",
//   });

//   useEffect(() => {
//     function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
//       if (event.key === "Escape" && isCreateUserOverlayVisible)
//         setIsCreateUserOverlayVisible(false);
//     }

//     document.addEventListener("keydown", handleCloseOverlayEscapeKey);

//     return () => {
//       document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
//     };
//   }, [isCreateUserOverlayVisible]);

//   function handleOverlayBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
//     if (event.target === event.currentTarget)
//       setIsCreateUserOverlayVisible(false);
//   }

//   function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
//     const { name, value } = event.target;
//     setUserToCreate((prevUserToCreate) => ({
//       ...prevUserToCreate,
//       [name]: value,
//     }));
//   }

//   useEffect(() => {
//     console.log(userToCreate);
//   }, [userToCreate]);

//   function onCreateUser() {
//     try {
//     } catch (error) {}
//   }

//   return (
//     <div>
//       <button onClick={() => setIsCreateUserOverlayVisible(true)}>
//         Create {roleName}
//       </button>
//       <div
//         className={`fixed inset-0 flex justify-center items-center transition-colors z-50  ${
//           isCreateUserOverlayVisible ? "visible bg-black/20" : "invisible"
//         }`}
//         onClick={(event) => handleOverlayBackdropClick(event)}
//       >
//         <div
// className={`bg-white border border-gray-500 w-2/3 h-2/3 rounded-xl shadow p-6 transition-all ${
//   isCreateUserOverlayVisible
//     ? "scale-100 opacity-100 duration-500"
//     : "scale-125 opacity-0 duration-500"
// }`}
//         >
{
  /* <div className="w-full flex justify-between">
  <div className="flex flex-col space-y-6">
    <StyledInput
      label="userForename"
      name="userForename"
      onChangeStyledInput={handleStyledInputChange}
    />
    <StyledInput
      label="userSurname"
      name="userSurname"
      onChangeStyledInput={handleStyledInputChange}
    />
    <StyledInput
      label="userEmail"
      name="userEmail"
      onChangeStyledInput={handleStyledInputChange}
    />
  </div>
  <div className="flex flex-col space-y-6">
    <StyledInput
      label="userPhoneNumber"
      name="userPhoneNumber"
      onChangeStyledInput={handleStyledInputChange}
    />
    <StyledInput
      label="userGender"
      name="userGender"
      onChangeStyledInput={handleStyledInputChange}
    />
    <StyledInput
      label="userDateOfBirth"
      name="userDateOfBirth"
      onChangeStyledInput={handleStyledInputChange}
    />
  </div>
  <div className="flex flex-col space-y-6">
    <StyledInput
      label="userAddress"
      name="userAddress"
      onChangeStyledInput={handleStyledInputChange}
    />
  </div>
</div>; */
}
//           <button onClick={() => setIsCreateUserOverlayVisible(false)}>
//             close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
