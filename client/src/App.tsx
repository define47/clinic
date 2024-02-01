import React, { FC, useContext, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { Login } from "./pages/common/Login";
import axios from "axios";
import { AuthenticatedUserDataContext } from "./contexts/UserContext";
import { Layout } from "./pages/common/Layout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Appointments } from "./pages/admin/Appointments";
import { Patients } from "./pages/admin/Patients";
import { Doctors } from "./pages/admin/Doctors";
import { Receptionists } from "./pages/admin/Receptionists";
import { MedicalSpecialities } from "./pages/admin/MedicalSpecialities";
import { Nurses } from "./pages/admin/Nurses";
import { Settings } from "./pages/admin/Settings";
import { AdminGuide } from "./pages/admin/AdminGuide";
import { ThemeContext } from "./contexts/ThemeContext";
import { MedicalProcedures } from "./pages/admin/MedicalProcedures";
import { authPath, verifyUserPath } from "./utils/dotenv";
import { AppointmentHistory } from "./pages/common/AppointmentHistory";

// function useSocket() {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const socketIo = io("http://192.168.2.16:40587", {
//       reconnection: true,
//       upgrade: true,
//       transports: ["websocket", "polling"],
//       query: { query: "this is supposed to be query" },
//       auth: { userId: "userId auth" },
//     });

//     setSocket(socketIo);

//     return function () {
//       socketIo.disconnect();
//     };
//   }, []);
//   return socket;
// }

// const App: React.FC = () => {
//   const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
//   const [welcome, setWelcome] = useState<string>("");
//   const socket = useSocket();

//   useEffect(() => {
//     if (socket) {
//       socket.on("connect", () => {
//         setIsSocketConnected(true);
//       });

//       socket.on("disconnect", () => {
//         setIsSocketConnected(false);
//       });

//       socket.on("welcome", (welcome) => {
//         console.log(`Received welcome message: ${welcome}`);
//         setWelcome(welcome);
//       });

//       socket.on("message", (message) => {
//         console.log(`Received welcome message: ${message}`);
//         setWelcome(message);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off("connect");
//         socket.off("disconnect");
//         socket.off("welcome");
//       }
//     };
//   }, [socket]);

//   return (
//     <div>
//       connected? {isSocketConnected.toString()} here: {welcome}
//     </div>
//   );
// };

const App: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  // const { themeValue, setThemeValue } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    async function verifyUser() {
      const response = await axios.post(
        `${verifyUserPath}`,
        {},
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data.success) {
        authenticatedUserDataSetState(JSON.parse(response.data.payload));
      } else {
        navigate("/login");
      }
    }

    verifyUser();
  }, [pathname]);

  // useEffect(() => {
  //   setThemeValue("light");
  // }, []);

  // useEffect(() => {
  //   console.log("state", authenticatedUserDataState);
  // }, [authenticatedUserDataState]);

  return (
    <div>
      {/* {JSON.stringify(authenticatedUserDataState)} */}
      <Routes>
        <Route path="/login" element={<Login />} />
        {authenticatedUserDataState.roleNames[0] === "admin" && (
          <>
            <Route path="/" element={<Navigate to="/admins/dashboard" />} />
            <Route
              path="/admin"
              element={<Navigate to="/admins/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={<Navigate to="/admins/dashboard" />}
            />
            <Route path="/" element={<Layout />}>
              <Route path="/admins/dashboard" element={<AdminDashboard />} />
              <Route path="/admins/appointments" element={<Appointments />} />
              <Route path="/admins/patients" element={<Patients />} />
              <Route path="/admins/doctors" element={<Doctors />} />
              <Route
                path="/admins/medical-specialities"
                element={<MedicalSpecialities />}
              />
              <Route
                path="/admins/medical-procedures"
                element={<MedicalProcedures />}
              />
              <Route path="/admins/nurses" element={<Nurses />} />
              <Route path="/admins/receptionists" element={<Receptionists />} />
              <Route path="/admins/settings" element={<Settings />} />
              <Route path="/admins/guide" element={<AdminGuide />} />
              <Route
                path="/admins/appointment-history/:appointmentId"
                element={<AppointmentHistory />}
              />
              <Route path="*" element={<p>Path not resolved</p>} />
            </Route>
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
