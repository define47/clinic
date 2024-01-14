import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://192.168.2.16:40587", {
      reconnection: true,
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

const App: React.FC = () => {
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [welcome, setWelcome] = useState<string>("");
  const socket = useSocket();

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
        setWelcome(welcome);
      });

      socket.on("message", (message) => {
        console.log(`Received welcome message: ${message}`);
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

  return (
    <div>
      connected? {isSocketConnected.toString()} here: {welcome}
    </div>
  );
};

export default App;
