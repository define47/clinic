import { FC, useState } from "react";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";

export const Notification: FC = () => {
  const [areNotificationsVisible, setAreNotificationsVisible] =
    useState<boolean>(false);

  return (
    <>
      <div className="relative">
        {areNotificationsVisible ? (
          <IoNotificationsSharp
            onClick={() => setAreNotificationsVisible(false)}
          />
        ) : (
          <IoNotificationsOutline
            onClick={() => setAreNotificationsVisible(true)}
          />
        )}
        <div
          className={`w-96 h-64 absolute top-3.5 z-50 right-1.5 bg-white border rounded-xl transition-all ${
            areNotificationsVisible
              ? "opacity-100 duration-500"
              : "opacity-0 duration-500"
          }`}
        ></div>
      </div>
    </>
  );
};
