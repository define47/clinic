import {
  ChangeEventHandler,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type StyledInputV2Props = {
  inputBackgroundColor?: string;
  iconAreaBackgroundColor?: string;
  styledInputWidth: string;
  unfocusedTextColor: string;
  unfocusedBorderColor: string;
  focusedTextColor: string;
  focusedBorderColor: string;
  unfocusedLabelColor: string;
  unfocusedLabelBackgroundColor: string;
  focusedLabelBackgroundColor: string;
  focusedLabelColor: string;
  focusedBorderColorIconArea: string;
  icon?: ReactNode;
  onClickIcon?: () => void;
  isDisabled: boolean;
  styledInputValue: string;
  onClickInput?: () => void;
  onChangeStyledInput: ChangeEventHandler<HTMLInputElement>;
  name: string;
  label: string;
};

export const StyledInputV2: FC<StyledInputV2Props> = ({
  inputBackgroundColor,
  iconAreaBackgroundColor,
  styledInputWidth,
  unfocusedTextColor,
  unfocusedBorderColor,
  focusedTextColor,
  focusedBorderColor,
  unfocusedLabelColor,
  focusedLabelBackgroundColor,
  unfocusedLabelBackgroundColor,
  focusedBorderColorIconArea,
  focusedLabelColor,
  icon,
  onClickIcon,
  isDisabled,
  onClickInput,
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
    <div className={`${styledInputWidth} relative flex items-center`}>
      <input
        //   border-red-600
        // text-red-600
        // focus:border-blue-300
        // focus:text-blue-300
        ref={styledInputRef}
        className={`w-full h-10 pl-1 ${
          inputBackgroundColor
            ? inputBackgroundColor
            : "bg-white dark:bg-darkMode-itemBackgroundColor"
        } border-y border-l outline-none rounded-tl-lg rounded-bl-lg transition-all duration-500 ${unfocusedBorderColor} ${focusedBorderColor} ${unfocusedTextColor} ${focusedTextColor} cursor-pointer disabled:cursor-not-allowed`}
        value={styledInputValue}
        name={name}
        onChange={(event) => {
          setDoesInputHaveText(event.target.value.trim() !== "");
          onChangeStyledInput(event);
        }}
        onClick={onClickInput}
        onFocus={() => {
          setIsInputFocused(true);
        }}
        onBlur={() => {
          setIsInputFocused(false);
        }}
        disabled={isDisabled}
        autoComplete="off"
      />
      <label
        onClick={() => {
          if (!isDisabled) {
            styledInputRef.current?.focus();
            if (typeof onClickInput === "function") onClickInput();
          }
        }}
        className={`absolute top-2 left-2  transition-all duration-500 ${
          isInputFocused || doesInputHaveText || styledInputValue
            ? `-translate-y-4 translate-x-1.5 ${focusedLabelBackgroundColor} text-xs`
            : `translate-y-0 translate-x-0 ${unfocusedLabelBackgroundColor}`
        } ${
          isInputFocused ? focusedLabelColor : unfocusedLabelColor
        } cursor-pointer`}
      >
        {label}
      </label>
      <div
        className={`h-10 w-5 pr-1 ${
          iconAreaBackgroundColor
            ? iconAreaBackgroundColor
            : "bg-white dark:bg-darkMode-itemBackgroundColor"
        } flex items-center justify-center border-y border-r rounded-tr-lg rounded-br-lg transition-all duration-500 cursor-pointer ${
          isInputFocused
            ? `${focusedBorderColorIconArea}`
            : `${unfocusedBorderColor}`
        }`}
        onClick={() => {
          if (!isDisabled) {
            if (!isInputFocused) {
              setIsInputFocused(true);
              styledInputRef.current?.focus();
            }
            if (typeof onClickIcon === "function") onClickIcon();
          }
        }}
      >
        <span
        // onClick={() => {
        //   if (typeof onClickIcon === "function") onClickIcon();
        // }}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};
