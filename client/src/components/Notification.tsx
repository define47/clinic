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

  // const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(([entry]) => {
  //     setIsIntersecting(entry.isIntersecting);
  //   });

  //   observer.observe(notificationRef.current!);
  //   return () => observer.disconnect();
  // }, []);

  // const [isEndOfDiv, setIsEndOfDiv] = useState(false);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const element = notificationRef.current;
  //     if (element) {
  //       // Calculate the difference between the total height of the content
  //       // and the height of the container (scrollTop + clientHeight).
  //       // If the difference is very small or negative, we are near the end.
  //       const isNearEnd =
  //         element.scrollHeight - (element.scrollTop + element.clientHeight) < 3;

  //       setIsEndOfDiv(isNearEnd);
  //     }
  //   };

  //   const element = notificationRef.current;
  //   if (element) {
  //     element.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     const element = notificationRef.current;
  //     if (element) {
  //       element.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log("reached end");
  // }, [isEndOfDiv]);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const containerHeight = 256;
  const itemHeight = 96;
  const totalHeight = userNotifications.length * itemHeight;
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(0);

  useEffect(() => {
    setStartIndex(Math.floor(scrollTop / itemHeight));
  }, [scrollTop]);

  useEffect(() => {
    setEndIndex(
      Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight),
        userNotifications.length
      )
    );
  }, [startIndex, userNotifications]);

  const [visibleItems, setVisibleItems] = useState<UserNotification[]>([]);

  useEffect(() => {
    console.log(startIndex, endIndex);
  }, [startIndex, endIndex]);

  useEffect(() => {
    setVisibleItems(userNotifications.slice(startIndex, endIndex));
  }, [userNotifications, startIndex, endIndex]);

  const [invisibleItemsHeight, setInvisibleItemsHeight] = useState<number>(0);
  useEffect(() => {
    setInvisibleItemsHeight(
      (startIndex + visibleItems.length - endIndex) * itemHeight
    );
  }, [startIndex, visibleItems, endIndex]);

  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };

  useEffect(() => {
    console.log(visibleItems);
  }, [visibleItems]);

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
          onScroll={handleScroll}
        >
          <div style={{ height: `${totalHeight}px` }}>
            <div
              style={{
                position: "relative",
                height: `${visibleItems.length * itemHeight}px`,
                top: `${startIndex * itemHeight}px`,
              }}
            >
              {visibleItems.length > 0 &&
                visibleItems !== undefined &&
                visibleItems.map((userNotification: UserNotification) => {
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
                    appointment?.appointmentDateTime?.split("T");
                  let appointmentDate, appointmentTime;
                  if (appointmentDateTime) {
                    appointmentDate = appointmentDateTime[0]
                      ?.split("-")
                      ?.reverse()
                      ?.join("-");
                    appointmentTime = appointmentDateTime[1].substring(0, 5);
                  }
                  return (
                    <div
                      className="w-full h-24 border-b text-xs"
                      style={{ height: `${itemHeight}px` }}
                    >
                      <div className="w-full flex items-center justify-end">
                        <span>
                          {userNotification.notification?.notificationDateTime
                            ?.split("T")[1]
                            ?.substring(0, 5)}
                        </span>
                      </div>
                      <div className="w-full h-8 flex items-center">
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
                        <span>{userNotification?.sender?.senderSurname}</span>
                        &nbsp;
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
                      <div className="flex flex-col h-8">
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
          <div style={{ height: `${invisibleItemsHeight}px` }} />
        </div>
      </div>
    </>
  );
};
