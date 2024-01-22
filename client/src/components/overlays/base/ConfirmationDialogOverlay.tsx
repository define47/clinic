import React, { FC, ReactNode, useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeConfirmationDialogModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const portalRoot = document.getElementById("confirmationDialog");

  return createPortal(
    <div className={className} onClick={closeConfirmationDialogModal}>
      {children}
    </div>,
    portalRoot!
  );
};
