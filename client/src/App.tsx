import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import io, { Socket } from "socket.io-client";

// const socket = io("http://192.168.2.16:40587", {
//   autoConnect: true,
// });
function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://192.168.2.16:40587", {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIo);

    return function () {
      socketIo.disconnect();
    };
  }, []);
  return socket;
}
const App: React.FC = () => {
  const [welcome, setWelcome] = useState<string>("");
  // const [socket, setSocket] = useState<Socket<
  //   DefaultEventsMap,
  //   DefaultEventsMap
  // > | null>(null);

  // useEffect(() => {
  //   const newSocket = io("http://192.168.2.16:40587");
  //   setSocket(newSocket);

  //   // return socket.disconnect()
  // }, []);

  // const [socket, setSocket] = useState(io.connect("ws://192.168.2.16:40587"));

  const socket = useSocket();

  socket?.on("welcome", (message) => {
    console.log(`Received welcome message: ${message}`);
    // setWelcome(welcome);
    // Handle the welcome message as needed
  });

  useEffect(() => {
    // Set up the event listener for "welcome" only once when the component mounts
    if (socket) {
      socket.on("welcome", (message) => {
        console.log(`Received welcome message: ${message}`);
        setWelcome(message); // Update the welcome state with the received message
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("welcome"); // Remove the "welcome" event listener
      }
    };
  }, [socket]); // Ensure that the effect runs when the socket changes

  return <div>here:{welcome}</div>;
};

export default App;
