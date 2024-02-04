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
  );
};