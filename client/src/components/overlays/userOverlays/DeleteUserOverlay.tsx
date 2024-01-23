import { FC, useState } from "react";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { DeleteUserOverlayPros } from "../../../types";
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5";
import axios from "axios";
import { usersPath } from "../../../utils/dotenv";

export const DeleteUserOverlay: FC<DeleteUserOverlayPros> = ({
  user,
  roleName,
}) => {
  const [
    isDeleteUserConfirmationDialogOverlayVisible,
    setIsDeleteUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  async function onDeleteUser() {
    try {
      const response = await axios.delete(usersPath, {
        data: { userId: user.userId },
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {isDeleteUserConfirmationDialogOverlayVisible ? (
        <IoTrashSharp className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <IoTrashOutline
          onClick={() => setIsDeleteUserConfirmationDialogOverlayVisible(true)}
          className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
        />
      )}
      <ConfirmationDialogOverlay
        className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
          isDeleteUserConfirmationDialogOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeConfirmationDialogModal={() =>
          setIsDeleteUserConfirmationDialogOverlayVisible(false)
        }
      >
        <div
          className={`w-1/3 h-1/4 bg-white flex transition-all rounded-xl ${
            isDeleteUserConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col p-4">
            <span className="w-full flex justify-center mb-8">
              Are you sure want to delete the {roleName}?
            </span>
            <div>
              <div>{user.userId}</div>
            </div>
            <div className="w-full flex justify-between">
              <StyledRippleButton
                label="Yes"
                type="yes"
                onClick={onDeleteUser}
              />
              <StyledRippleButton
                label="No"
                type="delete"
                onClick={() =>
                  setIsDeleteUserConfirmationDialogOverlayVisible(false)
                }
              />
            </div>
          </div>
        </div>
      </ConfirmationDialogOverlay>
    </div>
  );
};
