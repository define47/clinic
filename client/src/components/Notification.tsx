import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";
import { notificationsPath } from "../utils/dotenv";
import { AuthenticatedUserDataContext } from "../contexts/UserContext";

export const Notification: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [areNotificationsVisible, setAreNotificationsVisible] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchUserNotifications() {
      const response = await axios.get(notificationsPath, {
        params: {
          userId: authenticatedUserDataState.userId,
        },
        withCredentials: true,
      });

      console.log("notifications", response.data);
    }

    fetchUserNotifications();
  }, []);

  // useEffect(() => {}, [])

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
