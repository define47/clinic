import axios from "axios";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";
import { notificationsPath } from "../utils/dotenv";
import { AuthenticatedUserDataContext } from "../contexts/UserContext";
import { UserNotification } from "../types";
import { UserProfilePicture } from "./UserProfile/UserProfilePicture";

export const Notification: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [areNotificationsVisible, setAreNotificationsVisible] =
    useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [userNotifications, setUserNotifications] = useState<
    UserNotification[]
  >([]);
  const [isCursorOnBell, setIsCursorOnBell] = useState<boolean>(false);
  const [isCursorOnFilledBell, setIsCursorOnFilledBell] =
    useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setAreNotificationsVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    async function fetchUserNotifications() {
      const response = await axios.get(notificationsPath, {
        params: {
          userId: authenticatedUserDataState.userId,
        },
        withCredentials: true,
      });

      if (response.data.success === true)
        setUserNotifications(response.data.payload);
    }

    fetchUserNotifications();
  }, []);

  return (
    <>
      <div className="relative">
        {areNotificationsVisible ? (
          <IoNotificationsSharp
            className="text-xl text-pink-500 hover:scale-125 cursor-pointer"
            onClick={() => setAreNotificationsVisible(false)}
          />
        ) : (
          <IoNotificationsOutline
            className="text-xl text-pink-500 hover:scale-125 cursor-pointer"
            onClick={(e) => {
              setAreNotificationsVisible(true);
              e.stopPropagation();
            }}
          />
        )}
        <div className="w-4 h-4 absolute -top-2 left-3 flex items-center justify-center text-pink-800 bg-pink-400 rounded-full text-xs">
          {userNotifications.length}
        </div>
        <div
          ref={notificationRef}
          className={`w-96 h-64 p-3 absolute top-3.5 right-1.5 bg-white border rounded-xl transition-all ${
            areNotificationsVisible
              ? "opacity-100 duration-500 z-10"
              : "opacity-0 duration-500 z-0"
          } overflow-y-auto`}
        >
          {userNotifications.length > 0 &&
            userNotifications !== undefined &&
            userNotifications.map((userNotification: UserNotification) => {
              const parsedNotificationBody = JSON.parse(
                userNotification.notification.notificationBody
              );
              const parsedNotificationBodyData = JSON.parse(
                parsedNotificationBody
              );
              const appointment = parsedNotificationBodyData?.appointment;
              const doctor = parsedNotificationBodyData?.doctor;
              const patient = parsedNotificationBodyData?.patient;
              const appointmentDateTime =
                appointment?.appointmentDateTime.split("T");
              let appointmentDate, appointmentTime;
              if (appointmentDateTime) {
                appointmentDate = appointmentDateTime[0]
                  .split("-")
                  .reverse()
                  .join("-");
                appointmentTime = appointmentDateTime[1].substring(0, 5);
              }

              // const parsedAppointment = JSON.parse(parsedNotificationBody);

              // const parsedPatient = JSON.parse(parsedNotificationBody);
              return (
                // <div className="w-full border-b">
                //   <div className="w-full h-full flex items-center">
                //     <span>
                //       <UserProfilePicture
                //         userId={userNotification.sender.senderId}
                //       />
                //     </span>
                //     &nbsp;
                //     <span>{userNotification.sender.senderForename}</span>
                //     &nbsp;
                //     <span>{userNotification.sender.senderSurname}</span>
                //   </div>
                //   <div className="flex flex-col">
                //     <div className="flex">
                //       <span>
                //         {userNotification.notification.notificationAction}
                //       </span>
                //       &nbsp;
                //       <span>
                //         {userNotification.notification.notificationEntity}&nbsp;
                //       </span>
                //       FOR:
                //     </div>
                //     <div>
                //       <div>
                //         <span>{doctor.userForename}</span>
                //         <span>{doctor.userSurname}</span>
                //       </div>
                //       <div>
                //         <span>{patient.userForename}</span>
                //         <span>{patient.userSurname}</span>
                //       </div>
                //       <div>
                //         <span>{appointment.appointmentStatus}</span>&nbsp;
                //         <span>{appointmentDate}</span>&nbsp;
                //         <span>{appointmentTime}</span>&nbsp;
                //       </div>
                //     </div>
                //     <span>
                //       {userNotification.notification.notificationDateTime
                //         .split("T")[1]
                //         .substring(0, 5)}
                //     </span>
                //   </div>
                // </div>
                <div className="w-full border-b text-xs">
                  <div className="w-full flex items-center justify-end">
                    <span>
                      {userNotification.notification?.notificationDateTime
                        ?.split("T")[1]
                        ?.substring(0, 5)}
                    </span>
                  </div>
                  <div className="w-full h-full flex items-center">
                    <span>
                      <UserProfilePicture
                        userProfilePictureWidth="w-8"
                        userProfilePictureHeight="w-8"
                        userId={userNotification.sender.senderId}
                      />
                    </span>
                    &nbsp;
                    <span>{userNotification?.sender?.senderForename}</span>
                    &nbsp;
                    <span>{userNotification?.sender?.senderSurname}</span>&nbsp;
                    <div className="flex">
                      <span>
                        {userNotification?.notification?.notificationAction}
                      </span>
                      &nbsp;
                      <span>
                        {userNotification?.notification?.notificationEntity}
                        &nbsp;
                      </span>
                      FOR:
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <div>
                        <span>{doctor?.userForename}</span>
                        <span>{doctor?.userSurname}</span>
                      </div>
                      <div>
                        <span>{patient?.userForename}</span>
                        <span>{patient?.userSurname}</span>
                      </div>
                      <div>
                        <span>{appointment?.appointmentStatus}</span>&nbsp;
                        <span>{appointmentDate}</span>&nbsp;
                        <span>{appointmentTime}</span>&nbsp;
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
