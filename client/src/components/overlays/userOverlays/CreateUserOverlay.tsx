import { FC, useState } from "react";

export const CreateUserOverlay: FC = () => {
  const [isCreateUserOverlayVisible, setIsCreateUserOverlayVisible] =
    useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setIsCreateUserOverlayVisible(true)}>open</button>
      <div
        className={`fixed inset-0 flex justify-center items-center transition-colors ${
          isCreateUserOverlayVisible ? "visible bg-black/20" : "invisible"
        }`}
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
