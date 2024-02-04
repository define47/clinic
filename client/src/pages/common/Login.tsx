import { FC, useEffect } from "react";
import ParticlesBackground from "../../components/design/ParticlesBackground";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { verifyUserPath } from "../../utils/dotenv";

import { LoginUser } from "./LoginUser";

export const Login: FC = () => {
  const navigate = useNavigate();
  // const [userToLogin, setUserToLogin] = useState<UserToLogin>({
  //   userEmail: "",
  //   userPassword: "",
  // });

  useEffect(() => {
    async function verifyUser() {
      const response = await axios.post(
        `${verifyUserPath}`,
        {},
        { withCredentials: true }
      );

      console.log("here", response.data.payload);

      if (response.data.success) {
        // const payload = JSON.parse(response.data.payload);
        // if (payload.roleNames[0] === "admin") navigate("/admins/dashboard");
        navigate("/");
      }
    }

    verifyUser();
  }, []);

  // function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = e.target;
  //   setUserToLogin((prevUser) => ({ ...prevUser, [name]: value }));
  // }

  // async function onLogin() {
  //   try {
  //     const response = await axios.post(
  //       `${loginUserPath}`,
  //       { ...userToLogin },
  //       { withCredentials: true }
  //     );

  //     console.log(response.data);

  //     if (response.data.success) navigate("/");
  //     navigate(0);

  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <ParticlesBackground>
      {/* <div>
        <div className="h-full w-full flex absolute items-center justify-center">
          <div className="flex flex-col space-y-2">
            <StyledInput
              label="userEmail"
              name="userEmail"
              onChangeStyledInput={handleInputChange}
              labelBackgroundColor="bg-white"
            />
            <StyledInput
              label="userPassword"
              name="userPassword"
              onChangeStyledInput={handleInputChange}
              labelBackgroundColor="bg-white"
            />
            <button onClick={onLogin}>Submit</button>
          </div>
        </div>
      </div> */}
      <LoginUser />
    </ParticlesBackground>
  );
};
