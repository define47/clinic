import { FC, useEffect } from "react";
import ParticlesBackground from "../../../components/design/ParticlesBackground";
import { useNavigate } from "react-router-dom";
import { verifyUserAPIPath } from "../../../utils/dotenv";
import axios from "axios";
import { SignUpUser } from "./SignUpUser";

export const SignUp: FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      const response = await axios.post(
        `${verifyUserAPIPath}`,
        {},
        { withCredentials: true }
      );

      console.log("here", response.data.payload);

      if (response.data.success) {
        navigate("/");
      }
    }

    verifyUser();
  }, []);
  return (
    <ParticlesBackground>
      <SignUpUser />
    </ParticlesBackground>
  );
};
