import { ChangeEvent, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserToLogin } from "../../types";
import { loginUserPath } from "../../utils/dotenv";
import { StyledInput } from "../../components/design/StyledInput";
import axios from "axios";
import { StyledInputV2 } from "../../components/design/StyledInputV2";

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
      <div className="p-8 h-96 w-96 bg-transparent backdrop-blur-sm border border-gray-300 rounded-xl flex flex-col justify-center items-center space-y-4">
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
        <button onClick={onLogin}>Submit</button>
        <div className="text-gray-300">
          <span>Don't Have An Account?</span>&nbsp;
          <span className="hover:underline">Sign Up Here!</span>
          <div className="group text-blue-500 transition-all duration-300 ease-in-out">
            <span className="bg-left-bottom bg-gradient-to-r from-blue-500 to-blue-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
              This text gets underlined on hover from left
            </span>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
