import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../../../contexts/UserContext";
import { StyledInputV2 } from "../../../design/StyledInputV2";
import { User } from "../../../../types";
import {
  getEntityNamesByLanguage,
  getItemByLanguageAndCollection,
} from "../../../../utils/clientLanguages";

type UpdateFieldsUserProps = {
  roleName: string;
  userToUpdate: User;
  isUserForenameValid: boolean;
  isUserSurnameValid: boolean;
  isUserEmailValid: boolean;
  isUserPhoneNumberValid: boolean;
  selectedGenderName: string;
  setSelectedGenderName: (selectedGenderName: string) => void;
  selectedGenderValue: string;
  setSelectedGenderValue: (selectedGenderValue: string) => void;
};
export const UpdateFieldsUser: FC<UpdateFieldsUserProps> = ({
  roleName,
  userToUpdate,
  isUserForenameValid,
  isUserSurnameValid,
  isUserEmailValid,
  isUserPhoneNumberValid,
  selectedGenderValue,
  setSelectedGenderValue,
  selectedGenderName,
  setSelectedGenderName,
}) => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  return (
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
              selectedMedicalSpecialityId={selectedPrimaryMedicalSpecialityId}
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
  );
};
