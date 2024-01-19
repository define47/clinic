import React, { FC, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { Login } from "./pages/common/Login";
import axios from "axios";
import { AuthenticatedUserDataContext } from "./contexts/UserCtx";
import { Layout } from "./pages/common/Layout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Appointments } from "./pages/admin/Appointments";
import { Patients } from "./pages/admin/Patients";
import { Doctors } from "./pages/admin/Doctors";
import { Receptionists } from "./pages/admin/Receptionists";
import { Specialities } from "./pages/admin/Specialities";
import { Nurses } from "./pages/admin/Nurses";

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

  useEffect(() => {
    async function verifyUser() {
      const response = await axios.post(
        "http://192.168.2.16:40587/api/auth/read-signed-cookie",
        {},
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data.success) {
        authenticatedUserDataSetState(JSON.parse(response.data.payload));
      }
    }

    verifyUser();
  }, []);

  useEffect(() => {
    console.log("state", authenticatedUserDataState);
  }, [authenticatedUserDataState]);

  return (
    <div>
      {JSON.stringify(authenticatedUserDataState)}
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
              <Route path="/admins/specialities" element={<Specialities />} />
              <Route path="/admins/nurses" element={<Nurses />} />
              <Route path="/admins/receptionists" element={<Receptionists />} />
            </Route>
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
