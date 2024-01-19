import { ChangeEvent, FC, useEffect, useState } from "react";
import ParticlesBackground from "../../components/design/ParticlesBackground";
import { UserToLogin } from "../../types";
import axios from "axios";

export const Login: FC = () => {
  const [userToLogin, setUserToLogin] = useState<UserToLogin>({
    userEmail: "",
    userPassword: "",
  });

  useEffect(() => {
    async function verifyUser() {
      const response = await axios.post(
        "http://192.168.2.16:40587/api/auth/read-signed-cookie",
        {},
        { withCredentials: true }
      );

      console.log(JSON.parse(response.data.payload));
    }

    verifyUser();
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserToLogin((prevUser) => ({ ...prevUser, [name]: value }));
  }

  async function onLogin() {
    try {
      const response = await axios.post(
        "http://192.168.2.16:40587/api/auth/login",
        { ...userToLogin },
        { withCredentials: true }
      );

      console.log(response.data);

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ParticlesBackground>
      <div className="h-full w-full flex absolute items-center justify-center">
        <div className="flex flex-col space-y-2">
          <input name={"userEmail"} onChange={handleInputChange} />
          <input name={"userPassword"} onChange={handleInputChange} />
          <button onClick={onLogin}>Submit</button>
        </div>
      </div>
    </ParticlesBackground>
  );
};
