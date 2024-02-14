import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { CreateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import axios from "axios";
import { usersPath } from "../../../utils/dotenv";
import { MedicalSpecialityPicker } from "../../pickers/MedicalSpecialityPicker";
import { DateTimePicker } from "../../pickers/DateTimePicker";
import { ConfirmationDialogEntry } from "../../design/ConfirmationDialogEntry";

export const CreateUserOverlay: FC<CreateUserOverlayPros> = ({
  roleId,
  roleName,
}) => {
  const [isCreateUserOverlayVisible, setIsCreateUserOverlayVisible] =
    useState<boolean>(false);
  const [
    isCreateUserConfirmationDialogOverlayVisible,
    setIsCreateUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [userToCreate, setUserToCreate] = useState<User>({
    userId: "",
    userForename: "",
    userSurname: "",
    userEmail: "",
    userPhoneNumber: "",
    userGender: "male",
    userDateOfBirth: "1765-05-23",
    userAddress: "",
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
    setUserToCreate((prevUserToCreate) => ({
      ...prevUserToCreate,
      [name]: value,
    }));
  }

  async function onCreateUser() {
    try {
      const response = await axios.post(
        usersPath,
        {
          userForename: userToCreate.userForename,
          userSurname: userToCreate.userSurname,
          userEmail: userToCreate.userEmail,
          userPhoneNumber: userToCreate.userPhoneNumber,
          userGender: userToCreate.userGender,
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

  return (
    <>
      <StyledRippleButton
        label={`Create ${roleName}`}
        type="create"
        onClick={() => setIsCreateUserOverlayVisible(true)}
      />

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isCreateUserOverlayVisible ? "visible backdrop-blur-sm" : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`w-11/12 h-4/5 overflow-y-auto lg:w-3/4 lg:h-1/2 rounded-xl shadow p-6 bg-white border border-gray-500 transition-all ${
            isCreateUserOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create {roleName}</span>
          <div className="w-full lg:flex lg:justify-between">
            <div className="flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInput
                label="userForename"
                name="userForename"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue={`${roleName}FN`}
              />
              <StyledInput
                label="userSurname"
                name="userSurname"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue={`${roleName}LN`}
              />
              <StyledInput
                label="userEmail"
                name="userEmail"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue={`${roleName}EM`}
              />
            </div>
            <div className="flex flex-col items-center lg:items-baseline space-y-6 mb-6 lg:mb-0">
              <StyledInput
                styledInputWidth="w-40"
                label="userPhoneNumber"
                name="userPhoneNumber"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue={`${roleName}PH`}
              />
              <StyledInput
                label="userGender"
                name="userGender"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue="male"
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
                z="z-50"
              />
            </div>
            <div className="flex flex-col items-center lg:items-baseline space-y-6">
              <StyledInput
                label="userAddress"
                name="userAddress"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColorUnfocused="bg-white"
                labelBackgroundColorFocused="bg-white"
                defaultValue={`${roleName}Addr`}
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
                  />

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
                  />

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
                ? "visible backdrop-blur-sm"
                : "invisible"
            }`}
            closeConfirmationDialogModal={() =>
              setIsCreateUserConfirmationDialogOverlayVisible(false)
            }
          >
            <div
              className={`lg:w-2/3 lg:h-1/3 p-4 bg-white flex flex-col rounded-xl transition-all ${
                isCreateUserConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <span className="w-full flex items-center justify-center text-xl font-bold">
                  Are You Sure You Want To Create The {roleName}?
                </span>
                <div className="w=full flex justify-between mt-4">
                  <div className="">
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userForename"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userForename}
                    />
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userSurname"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userSurname}
                    />
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userEmail"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userEmail}
                    />
                  </div>
                  <div className="">
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="Phone Number"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userPhoneNumber}
                    />
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userGender"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userGender}
                    />
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userEmail"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userDateOfBirth
                        .split("-")
                        .reverse()
                        .join("-")}
                    />
                  </div>
                  <div className="">
                    <ConfirmationDialogEntry
                      confirmationDialogEntryTitleWidth="w-24"
                      confirmationDialogEntryTitle="userAddress"
                      confirmationDialogEntryBodyWidth="w-72"
                      confirmationDialogEntryBody={userToCreate.userAddress}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between mt-10">
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
