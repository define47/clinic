import { ChangeEvent, FC, useEffect, useState } from "react";
import { CreateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import axios from "axios";
import { userPath } from "../../../utils/dotenv";

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

  useEffect(() => {
    console.log(userToCreate);
  }, [userToCreate]);

  async function onCreateUser() {
    try {
      const response = await axios.post(
        userPath,
        {
          userForename: userToCreate.userForename,
          userSurname: userToCreate.userSurname,
          userEmail: userToCreate.userEmail,
          userPhoneNumber: userToCreate.userPhoneNumber,
          userGender: userToCreate.userGender,
          userDateOfBirth: userToCreate.userDateOfBirth,
          userAddress: userToCreate.userAddress,
          userEncryptedPassword: "",
          roleIds: [roleId],
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

  return (
    <>
      <StyledRippleButton
        label={`Create ${roleName}`}
        type="create"
        onClick={() => setIsCreateUserOverlayVisible(true)}
      />

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isCreateUserOverlayVisible ? "visible backdrop-blur-sm" : "invisible"
        }`}
        closeModal={() => setIsCreateUserOverlayVisible(false)}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isCreateUserOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="flex justify-center mb-8">Create {roleName}</span>
          <div className="w-full flex justify-between">
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userForename"
                name="userForename"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="patientFN"
              />
              <StyledInput
                label="userSurname"
                name="userSurname"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="patientLN"
              />
              <StyledInput
                label="userEmail"
                name="userEmail"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="patientEM"
              />
            </div>
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userPhoneNumber"
                name="userPhoneNumber"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="patientPH"
              />
              <StyledInput
                label="userGender"
                name="userGender"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="male"
              />
              <StyledInput
                label="userDateOfBirth"
                name="userDateOfBirth"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="1765-05-23"
              />
            </div>
            <div className="flex flex-col space-y-6">
              <StyledInput
                label="userAddress"
                name="userAddress"
                onChangeStyledInput={handleStyledInputChange}
                labelBackgroundColor="bg-white"
                defaultValue="patientAddr"
              />
            </div>
          </div>
          <div className="w-full mt-14 flex justify-between">
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
              className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                isCreateUserConfirmationDialogOverlayVisible
                  ? "scale-100 opacity-100 duration-200"
                  : "scale-125 opacity-0 duration-200"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
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
