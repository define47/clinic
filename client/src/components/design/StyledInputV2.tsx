import { FC, ReactNode, useRef, useState } from "react";

type StyledInputV2Props = { icon?: ReactNode };

export const StyledInputV2: FC<StyledInputV2Props> = ({ icon }) => {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [doesInputHaveText, setDoesInputHaveText] = useState<boolean>(false);
  const styledInputRef = useRef<HTMLInputElement | null>(null);
  const handleInputChange = (event: { target: { value: string } }) => {
    setDoesInputHaveText(event.target.value.trim() !== "");
  };

  return (
    <div className="flex items-center">
      <input
        ref={styledInputRef}
        className="w-72 h-10 bg-white relative border-y border-l outline-none rounded-tl-lg rounded-bl-lg transition-all duration-500 border-red-600 focus:border-blue-300 text-red-600 focus:text-blue-300 cursor-pointer"
        onChange={handleInputChange}
        onFocus={() => {
          setIsInputFocused(true);
        }}
        onBlur={() => {
          setIsInputFocused(false);
        }}
      />
      <label
        onClick={() => {
          styledInputRef.current?.focus();
        }}
        className={`absolute top-4 left-5  transition-all duration-500 ${
          isInputFocused || doesInputHaveText
            ? `-translate-y-2 translate-x-1.5 bg-gray-50 text-xs`
            : `translate-y-2 translate-x-0 bg-white`
        } cursor-pointer`}
      >
        label
      </label>
      <div
        className={`h-10 w-10 bg-white flex items-center border-y border-r rounded-tr-lg rounded-br-lg transition-all duration-500 ${
          isInputFocused ? "border-blue-300" : "border-red-600 "
        }`}
      >
        {icon}
      </div>
    </div>
  );
};
