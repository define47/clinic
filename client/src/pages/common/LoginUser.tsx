import { ChangeEvent, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserToLogin } from "../../types";
import { loginUserPath } from "../../utils/dotenv";
import { StyledInput } from "../../components/design/StyledInput";
import axios from "axios";

export const LoginUser: FC = () => {
  const navigate = useNavigate();
  const [userToLogin, setUserToLogin] = useState<UserToLogin>({
    userEmail: "",
    userPassword: "",
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserToLogin((prevUser) => ({ ...prevUser, [name]: value }));
  }

  async function onLogin() {
    try {
      const response = await axios.post(
        `${loginUserPath}`,
        { ...userToLogin },
        { withCredentials: true }
      );

      console.log(response.data);

      if (response.data.success) navigate("/");
      navigate(0);

      return response;
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="h-full w-full flex absolute items-center justify-center">
      <div className="h-96 w-96 bg-transparent backdrop-blur-sm border border-gray-300 rounded-xl flex flex-col justify-center items-center space-y-4">
        <StyledInput
          label="userEmail"
          name="userEmail"
          onChangeStyledInput={handleInputChange}
          labelBackgroundColor="bg-black"
          textColor="text-white"
          labelColor="text-white"
        />
        <StyledInput
          label="userPassword"
          name="userPassword"
          onChangeStyledInput={handleInputChange}
          labelBackgroundColor="bg-black"
          textColor="text-white"
          labelColor="text-white"
        />
        <button onClick={onLogin}>Submit</button>
      </div>
    </div>
  );
};
