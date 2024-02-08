import { FC, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { Sidebar } from "../../components/bars/Sidebar";
import { TopBar } from "../../components/bars/TopBar";
import { Socket, io } from "socket.io-client";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";
import { serverURL, verifyUserPath } from "../../utils/dotenv";
import axios from "axios";
import useDeviceDetection from "../../utils/useDeviceDetection";
import { BottomBar } from "../../components/bars/BottomBar";
import { TopBarMobile } from "../../components/bars/TopBarMobile";

// const App: React.FC = () => {

//   return (
//     <div>
//       connected? {isSocketConnected.toString()} here: {welcome}
//     </div>
//   );
// };

export const Layout: FC = () => {
  function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
      // "http://192.168.2.14:40587"
      const socketIo = io(serverURL, {
        reconnection: false,
        upgrade: true,
        transports: ["websocket", "polling"],
        query: { query: "this is supposed to be query" },
        auth: { userId: "userId auth" },
      });

      setSocket(socketIo);

      return function () {
        socketIo.disconnect();
      };
    }, []);
    return socket;
  }

  // const navigate = useNavigate();
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   async function verifyUser() {
  //     try {
  //       const response = await axios.post(
  //         `${verifyUserPath}`,
  //         {},
  //         { withCredentials: true }
  //       );

  //       console.log("here", response.data.payload);

  //       if (response.data.success) {
  //         // const payload = JSON.parse(response.data.payload);
  //         // if (payload.roleNames[0] === "admin") navigate("/admins/dashboard");
  //       } else {
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       navigate("/login");
  //     }
  //   }

  //   verifyUser();
  // }, [pathname]);

  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState } = authContext!;
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [welcome, setWelcome] = useState<string>("");
  const socket = useSocket();

  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsSocketConnected(true);
      });

      socket.on("disconnect", () => {
        setIsSocketConnected(false);
      });

      socket.on("welcome", (welcome) => {
        console.log(`Received welcome message: ${welcome}`);
        socketNotificationDataSetState(welcome);
        setWelcome(welcome);
      });

      socket.on("message", (message) => {
        console.log(`Received welcome message: ${message}`);
        socketNotificationDataSetState(message);
        setWelcome(message);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("welcome");
      }
    };
  }, [socket]);

  const { device, orientation } = useDeviceDetection();
  useEffect(() => {
    console.log(`LAyout Current device type: ${device} ${orientation}`);
  }, [device, orientation]);

  function determineUserLayout() {
    let content = <div></div>;

    if (
      authenticatedUserDataState.roleNames.length === 1 &&
      authenticatedUserDataState.roleNames[0] === "admin"
    )
      content =
        // select-none
        device === "Desktop" ? (
          <div className="w-screen h-screen flex">
            <div className="lg:fixed h-full hidden lg:block z-10">
              <Sidebar
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
              />
            </div>

            <div className="w-full flex flex-col h-full flex-wrap">
              <div className="w-full">
                <TopBar
                  isSidebarExtended={isSidebarExpanded}
                  setIsSidebarExtended={setIsSidebarExpanded}
                />
              </div>
              <div
                // md:static
                // left-20 top-14
                // flex justify-center
                className={`p-4 lg:fixed lg:left-20 lg:top-14 lg:z-0  lg:h-[calc(100%-56px)] w-full h-full overflow-y-auto lg:w-[calc(100%-80px)] transition-all bg-lightMode-layoutColor dark:bg-darkMode-backgroundColor`}
              >
                {/* connected? {isSocketConnected.toString()} here: {welcome} */}
                <Outlet />
              </div>
            </div>
          </div>
        ) : device === "Mobile" ? (
          // h-lvh
          <div className="relative h-dvh bg-lightMode-layoutColor dark:bg-darkMode-backgroundColor">
            {/* <div className="w-full bg-purple-200">hello</div> */}
            {/* <TopBarMobile /> */}

            <div
              // h-[calc(100dvh-70.4px)]
              className={`p-4 h-[calc(100dvh-60px)] overflow-y-auto bg-lightMode-layoutColor dark:bg-darkMode-backgroundColor`}
            >
              <Outlet />
            </div>
            <BottomBar />
          </div>
        ) : (
          <div></div>
        );

    return content;
  }

  return (
    // <div>
    //   {/* {JSON.stringify(authenticatedUserDataState)} */}
    //   Layout <Outlet />
    // </div>
    determineUserLayout()
  );
};
