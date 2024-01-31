import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { UpdateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import axios from "axios";
import { userPath } from "../../../utils/dotenv";
import { PiPencil, PiPencilLineFill } from "react-icons/pi";
import { MedicalSpecialityPicker } from "../../pickers/MedicalSpecialityPicker";
import { determineSpecialityOrder } from "../../../utils/utils";
import { DateTimePicker } from "../../pickers/DateTimePicker";

export const UpdateUserOverlay: FC<UpdateUserOverlayPros> = ({
  user,
  roleName,
}) => {
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

  //   useEffect(() => {
  //     console.log("userToUpdate useEffect", userToUpdate);
  //   }, [userToUpdate]);

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
    console.log("userToUpdate", userToUpdate);
  }, [userToUpdate, isUpdateUserOverlayVisible]);

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

  function handleStyledInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUserToUpdate((prevUserToUpdate) => ({
      ...prevUserToUpdate,
      [name]: value,
    }));
  }

  //   useEffect(() => {
  //     console.log("userToUpdate", userToUpdate);
  //   }, [userToUpdate]);

  async function onUpdateUser() {
    try {
      const response = await axios.put(
        userPath,
        {
          userId: user.userId,
          userForename: userToUpdate.userForename,
          userSurname: userToUpdate.userSurname,
          userEmail: userToUpdate.userEmail,
          userPhoneNumber: userToUpdate.userPhoneNumber,
          userGender: userToUpdate.userGender,
          userDateOfBirth: userToUpdate.userDateOfBirth,
          userAddress: userToUpdate.userAddress,
          userEncryptedPassword: "",
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
        <PiPencil
          onClick={() => setIsUpdateUserOverlayVisible(true)}
          className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
        />
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isUpdateUserOverlayVisible ? "visible backdrop-blur-sm" : "invisible"
        }`}
        // closeModal={() => setIsUpdateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
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
          <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userForename"
                name="userForename"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userForename}
                // inputValue=""
              />
              <StyledInput
                label="userSurname"
                name="userSurname"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userSurname}
              />
              <StyledInput
                label="userEmail"
                name="userEmail"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userEmail}
              />
            </div>
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userPhoneNumber"
                name="userPhoneNumber"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userPhoneNumber}
              />
              <StyledInput
                label="userGender"
                name="userGender"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userGender}
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
              />
            </div>
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userAddress"
                name="userAddress"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                inputValue={userToUpdate.userAddress}
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
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
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
