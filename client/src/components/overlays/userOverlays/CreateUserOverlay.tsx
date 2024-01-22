import { ChangeEvent, FC, useEffect, useState } from "react";
import { CreateUserOverlayPros, User } from "../../../types";
import { StyledInput } from "../../design/StyledInput";
import Overlay from "../base/Overlay";
import { ConfirmationDialogModal } from "../baseConfirmationDialog/ConfirmationDialogModal";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";

export const CreateUserOverlay: FC<CreateUserOverlayPros> = ({ roleName }) => {
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
    userGender: "",
    userDateOfBirth: "",
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

  function onCreateUser() {
    try {
      ("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <button onClick={() => setIsCreateUserOverlayVisible(true)}>
        Open Modal
      </button>
      {isCreateUserOverlayVisible && (
        <Overlay closeModal={() => setIsCreateUserOverlayVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Modal Create User</h3>
            <div className="w-full flex justify-between">
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
            </div>
            <button
              className="text-black"
              onClick={() => setIsCreateUserOverlayVisible(false)}
            >
              Close User Creation Modal
            </button>

            <button
              className="text-black"
              onClick={() =>
                setIsCreateUserConfirmationDialogOverlayVisible(true)
              }
            >
              Open Modal Confirmation
            </button>
            {isCreateUserConfirmationDialogOverlayVisible && (
              <ConfirmationDialogOverlay
                closeConfirmationDialogModal={() =>
                  setIsCreateUserConfirmationDialogOverlayVisible(false)
                }
              >
                Close
              </ConfirmationDialogOverlay>
            )}
          </div>
        </Overlay>
      )}
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
//           className={`bg-white border border-gray-500 w-2/3 h-2/3 rounded-xl shadow p-6 transition-all ${
//             isCreateUserOverlayVisible
//               ? "scale-100 opacity-100 duration-500"
//               : "scale-125 opacity-0 duration-500"
//           }`}
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
