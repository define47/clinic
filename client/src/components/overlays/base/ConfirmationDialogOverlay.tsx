import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

type OverlayProps = {
  closeConfirmationDialogModal: () => void;
  children: ReactNode;
  className: string;
};

export const ConfirmationDialogOverlay: FC<OverlayProps> = ({
  closeConfirmationDialogModal,
  children,
  className,
}) => {
  const confirmationDialogPortalRoot =
    document.getElementById("confirmationDialog");

  return createPortal(
    <div className={className} onClick={closeConfirmationDialogModal}>
      {children}
    </div>,
    confirmationDialogPortalRoot!
  );
};
