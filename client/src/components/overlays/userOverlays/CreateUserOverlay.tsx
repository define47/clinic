import { FC, useEffect, useState } from "react";
import { CreateUserOverlayPros } from "../../../types";

export const CreateUserOverlay: FC<CreateUserOverlayPros> = ({ roleName }) => {
  const [isCreateUserOverlayVisible, setIsCreateUserOverlayVisible] =
    useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape" && isCreateUserOverlayVisible)
        setIsCreateUserOverlayVisible(false);
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [isCreateUserOverlayVisible]);

  function handleOverlayBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget)
      setIsCreateUserOverlayVisible(false);
  }

  return (
    <div>
      <button onClick={() => setIsCreateUserOverlayVisible(true)}>
        Create {roleName}
      </button>
      <div
        className={`fixed inset-0 flex justify-center items-center transition-colors ${
          isCreateUserOverlayVisible ? "visible bg-black/20" : "invisible"
        }`}
        onClick={(event) => handleOverlayBackdropClick(event)}
      >
        <div
          className={`bg-white w-2/3 h-2/3 rounded-xl shadow p-6 transition-all ${
            isCreateUserOverlayVisible
              ? "scale-100 opacity-100 duration-1000"
              : "scale-125 opacity-0 duration-1000"
          }`}
        >
          <input />
          <button onClick={() => setIsCreateUserOverlayVisible(false)}>
            close
          </button>
        </div>
      </div>
    </div>
  );
};
