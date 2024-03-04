import { FC, useEffect, useState } from "react";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { DeleteUserOverlayPros, Patient, User } from "../../../types";
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5";
import axios from "axios";
import { userAPIPath, usersAPIPath } from "../../../utils/dotenv";
import { Tooltip } from "../../design/Tooltip";
import { Toaster, toast } from "sonner";

export const DeleteUserOverlay: FC<DeleteUserOverlayPros> = ({
  user,
  roleName,
}) => {
  const [
    isDeleteUserConfirmationDialogOverlayVisible,
    setIsDeleteUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDeleteUserConfirmationDialogOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [isDeleteUserConfirmationDialogOverlayVisible]);

  async function onDeleteUser() {
    try {
      const response = await axios.delete(userAPIPath, {
        data: { userId: user.userId },
        withCredentials: true,
      });

      if (response.data.success) {
        setIsDeleteUserConfirmationDialogOverlayVisible(false);

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {isDeleteUserConfirmationDialogOverlayVisible ? (
        <IoTrashSharp className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Delete ${roleName}`}>
          <IoTrashOutline
            onClick={() =>
              setIsDeleteUserConfirmationDialogOverlayVisible(true)
            }
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <ConfirmationDialogOverlay
        className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
          isDeleteUserConfirmationDialogOverlayVisible ? "visible" : "invisible"
        }`}
        closeConfirmationDialogModal={() =>
          setIsDeleteUserConfirmationDialogOverlayVisible(false)
        }
      >
        <div
          className={`w-1/3 h-1/4 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 flex transition-all rounded-xl ${
            isDeleteUserConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col p-4">
            <span className="w-full flex justify-center dark:text-gray-500 mb-8">
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
        <Toaster position="top-right" richColors />
      </ConfirmationDialogOverlay>
    </div>
  );
};
