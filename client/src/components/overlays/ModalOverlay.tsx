// ModalOverlay.tsx
import React, { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalOverlayProps = {
  closeModal: () => void;
  //   children: ReactNode;
};

const ModalOverlay: FC<ModalOverlayProps> = ({ closeModal }) => {
  const portalRoot = document.getElementById("portal");

  if (!portalRoot) {
    console.error("Portal root element not found");
    return null;
  }

  return createPortal(
    <div className="overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* {children} */}
        <>
          <h3>Modal</h3>
          <p>Modal here</p>
        </>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>,
    portalRoot!
  );
};

export default ModalOverlay;
