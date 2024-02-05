import { useState, useEffect } from "react";

const useDeviceDetection = () => {
  const [device, setDevice] = useState("");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    window.innerWidth < window.innerHeight ? "portrait" : "landscape"
  );

  useEffect(() => {
    const handleDeviceDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet =
        /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      let newDevice = "";

      if (isMobile) {
        newDevice = "Mobile";
      } else if (isTablet) {
        newDevice = "Tablet";
      } else {
        newDevice = "Desktop";
      }

      if (newDevice !== device) {
        setDevice(newDevice);
      }

      const newOrientation =
        window.innerWidth < window.innerHeight ? "portrait" : "landscape";

      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
      }
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, [device, orientation]); // Include 'device' and 'orientation' in the dependency array

  return { device, orientation };
};

export default useDeviceDetection;
