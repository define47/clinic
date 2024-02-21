import { ChangeEvent, FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserToLogin } from "../../types";
import { loginUserPath } from "../../utils/dotenv";
import { StyledInput } from "../../components/design/StyledInput";
import axios from "axios";
import { StyledInputV2 } from "../../components/design/StyledInputV2";
import { UnderlinedText } from "../../components/design/UnderlinedText";

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
      <div className="p-8 h-3/5 w-4/5 lg:h-2/5 lg:w-1/5 bg-transparent backdrop-blur-sm border border-gray-300 rounded-xl flex flex-col justify-center items-center space-y-4">
        <span className="text-gray-300 text-xl">Welcome Back</span>
        {/* <StyledInput
          label="userEmail"
          name="userEmail"
          onChangeStyledInput={handleInputChange}
          labelBackgroundColorUnfocused="bg-transparent"
          labelBackgroundColorFocused="!bg-black"
          textColorUnfocused="text-emerald-600"
          textColorFocused="focus:text-green-500"
          labelColor="text-white"
        /> */}
        <StyledInputV2
          inputBackgroundColor="bg-transparent"
          iconAreaBackgroundColor="bg-transparent"
          unfocusedTextColor="text-gray-300"
          unfocusedBorderColor="border-gray-300"
          focusedTextColor="focus:text-white"
          focusedBorderColor="focus:border-white"
          unfocusedLabelColor="text-gray-300"
          unfocusedLabelBackgroundColor="bg-transparent"
          focusedBorderColorIconArea="border-white"
          focusedLabelColor="text-white"
          focusedLabelBackgroundColor="bg-black"
          onClickIcon={() => console.log("hello icon")}
          isDisabled={false}
          label="Email"
          name="userEmail"
          onChangeStyledInput={handleInputChange}
          styledInputValue={userToLogin.userEmail}
          styledInputWidth="w-full"
        />
        <StyledInputV2
          inputBackgroundColor="bg-transparent"
          iconAreaBackgroundColor="bg-transparent"
          unfocusedTextColor="text-gray-300"
          unfocusedBorderColor="border-gray-300"
          focusedTextColor="focus:text-white"
          focusedBorderColor="focus:border-white"
          unfocusedLabelColor="text-gray-300"
          unfocusedLabelBackgroundColor="bg-transparent"
          focusedBorderColorIconArea="border-white"
          focusedLabelColor="text-white"
          focusedLabelBackgroundColor="bg-black"
          onClickIcon={() => console.log("hello icon")}
          isDisabled={false}
          label="Password"
          name="userPassword"
          onChangeStyledInput={handleInputChange}
          styledInputValue={userToLogin.userPassword}
          styledInputWidth="w-full"
        />
        {/* <StyledInput
          label="userPassword"
          name="userPassword"
          onChangeStyledInput={handleInputChange}
          labelBackgroundColorUnfocused="bg-transparent"
          labelBackgroundColorFocused="!bg-black"
          textColorUnfocused="text-emerald-600"
          textColorFocused="focus:text-green-500"
          labelColor="text-white"
        /> */}
        <span
          className="w-2/3 flex items-center justify-center border bg-transparent text-gray-300 py-2 px-5 rounded-xl cursor-pointer transition-all duration-500 hover:bg-white hover:text-black"
          onClick={onLogin}
        >
          Login
        </span>
        <div className="w-full flex flex-col items-center justify-center text-gray-300">
          <span>Don't Have An Account?</span>

          <Link to="/signup">
            <UnderlinedText
              text="Sign Up Here!"
              textColor="text-pink-500"
              underlineColorGradientStart="from-pink-600"
              underlineColorGradientEnd="to-pink-600"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
