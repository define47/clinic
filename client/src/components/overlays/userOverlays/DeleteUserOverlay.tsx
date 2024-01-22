import { FC, useState } from "react";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { DeleteUserOverlayPros } from "../../../types";

export const DeleteUserOverlay: FC<DeleteUserOverlayPros> = ({
  user,
  roleName,
}) => {
  const [
    isDeleteUserConfirmationDialogOverlayVisible,
    setIsDeleteUserConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  return (
    <div>
      <StyledRippleButton
        label="Continue"
        type="create"
        onClick={() => setIsDeleteUserConfirmationDialogOverlayVisible(true)}
      />
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
          className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
            isDeleteUserConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <StyledRippleButton label="Yes" type="yes" onClick={() => {}} />
          <StyledRippleButton
            label="No"
            type="delete"
            onClick={() =>
              setIsDeleteUserConfirmationDialogOverlayVisible(false)
            }
          />
        </div>
      </ConfirmationDialogOverlay>
    </div>
  );
};
