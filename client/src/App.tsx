import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [counterEvents, setCounterEvents] = useState<number>(0);

  const connectToSSE = () => {
    const eventSource = new EventSource("http://192.168.2.16:40587/sse");

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      // setEvents((prevEvents) => [
      //   ...prevEvents,
      //   `Notification received: ${eventData.notification}`,
      // ]);
      console.log(JSON.parse(event.data).counter);

      if (JSON.parse(event.data).type === "counter")
        setCounterEvents(JSON.parse(event.data).counter);
      else if (JSON.parse(event.data).type === "other")
        setEvents((prevEvents) => [
          ...prevEvents,
          `Notification received: ${eventData.notification}`,
        ]);
    };

    return eventSource;
  };

  useEffect(() => {
    connectToSSE();
  }, []);

  const handleButtonClick = async () => {
    try {
      const response = await fetch("http://192.168.2.16:40587/notify-clients", {
        method: "POST",
      });

      if (response.ok) {
        // Notification sent to server, awaiting response
        console.log("Notification sent successfully");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleIncrementCounterClick = async () => {
    try {
      const response = await fetch("http://192.168.2.16:40587/counter", {
        method: "POST",
      });

      if (response.ok) {
        // Notification sent to server, awaiting response
        console.log("Notification sent successfully", response);
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div>
      <h1>Real-time Events from Fastify Server</h1>
      <button onClick={handleButtonClick}>Notify Clients</button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
      <button onClick={handleIncrementCounterClick}>Increment</button>
      {counterEvents}
    </div>
  );
};

export default App;
