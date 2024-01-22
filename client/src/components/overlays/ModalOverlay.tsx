// ModalOverlay.tsx
import React, { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalOverlayProps = {
  closeModal: () => void;
  children: ReactNode;
};

const ModalOverlay: FC<ModalOverlayProps> = ({ closeModal, children }) => {
  const portalRoot = document.getElementById("portal");

  if (!portalRoot) {
    console.error("Portal root element not found");
    return null;
  }

  return createPortal(
    <div className="overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}

        <button onClick={closeModal}>Close</button>
      </div>
    </div>,
    portalRoot!
  );
};

export default ModalOverlay;
