import {
  ChangeEventHandler,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type StyledInputV2Props = {
  unfocusedTextColor: string;
  unfocusedBorderColor: string;
  focusedTextColor: string;
  focusedBorderColor: string;
  unfocusedLabelColor: string;
  unfocusedLabelBackgroundColor: string;
  focusedLabelBackgroundColor: string;
  focusedLabelColor: string;
  icon?: ReactNode;
  onClickIcon?: () => void;
  isDisabled: boolean;
  styledInputValue: string;
  onChangeStyledInput: ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
};

export const StyledInputV2: FC<StyledInputV2Props> = ({
  unfocusedTextColor,
  unfocusedBorderColor,
  focusedTextColor,
  focusedBorderColor,
  unfocusedLabelColor,
  focusedLabelBackgroundColor,
  unfocusedLabelBackgroundColor,
  focusedLabelColor,
  icon,
  onClickIcon,
  isDisabled,
  styledInputValue,
  onChangeStyledInput,
  name,
  label,
}) => {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [doesInputHaveText, setDoesInputHaveText] = useState<boolean>(false);
  const styledInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log(isInputFocused);
  }, [isInputFocused]);

  return (
    <div className="relative flex items-center">
      <input
        //   border-red-600
        // text-red-600
        // focus:border-blue-300
        // focus:text-blue-300
        ref={styledInputRef}
        className={`w-72 h-10 pl-1 bg-white border-y border-l outline-none rounded-tl-lg rounded-bl-lg transition-all duration-500 ${unfocusedBorderColor} ${focusedBorderColor} ${unfocusedTextColor} ${focusedTextColor} cursor-pointer`}
        value={styledInputValue}
        name={name}
        onChange={(event) => {
          setDoesInputHaveText(event.target.value.trim() !== "");
          onChangeStyledInput(event);
        }}
        onFocus={() => {
          setIsInputFocused(true);
        }}
        onBlur={() => {
          setIsInputFocused(false);
        }}
        disabled={isDisabled}
      />
      <label
        onClick={() => {
          styledInputRef.current?.focus();
        }}
        className={`absolute  top-2 left-2  transition-all duration-500 ${
          isInputFocused || doesInputHaveText
            ? `-translate-y-4 translate-x-1.5 ${focusedLabelBackgroundColor} text-xs`
            : `translate-y-0 translate-x-0 ${unfocusedLabelBackgroundColor}`
        } ${
          isInputFocused ? focusedLabelColor : unfocusedLabelColor
        } cursor-pointer`}
      >
        {label}
      </label>
      <div
        className={`h-10 w-5 pr-1 bg-white flex items-center justify-center border-y border-r rounded-tr-lg rounded-br-lg transition-all duration-500 cursor-pointer ${
          isInputFocused
            ? `${focusedBorderColor.split(":")[1]}`
            : `${unfocusedBorderColor}`
        }`}
        onClick={() => {
          if (!isInputFocused) {
            setIsInputFocused(true);
            styledInputRef.current?.focus();
          }
        }}
      >
        <span
          onClick={() => {
            if (typeof onClickIcon === "function") onClickIcon();
          }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};
