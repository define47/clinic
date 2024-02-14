import { ChangeEventHandler, FC, ReactNode, useRef, useState } from "react";

type StyledInputProps = {
  label: string;
  name: string;
  styledInputWidth?: string;
  onChangeStyledInput: ChangeEventHandler<HTMLTextAreaElement>;
  // MouseEventHandler<HTMLInputElement>
  onClickInput?: () => void;
  textColor?: string;
  textColorUnfocused?: string;
  textColorFocused?: string;
  borderColorUnfocused?: string;
  borderColorFocused?: string;
  labelColor?: string;
  labelUnfocused?: string;
  labelFocused?: string;
  labelBackgroundColorUnfocused?: string;
  labelBackgroundColorFocused?: string;
  defaultValue?: string;
  inputValue?: string;
  icon?: ReactNode;
  isPicker?: boolean;
  isPickerVisible?: boolean;
  disabled?: boolean;
};

export const StyledTextArea: FC<StyledInputProps> = ({
  label,
  name,
  styledInputWidth,
  onChangeStyledInput,
  onClickInput,
  textColor,
  textColorUnfocused,
  textColorFocused,
  borderColorUnfocused,
  borderColorFocused,
  labelColor,
  labelUnfocused,
  labelFocused,
  labelBackgroundColorUnfocused,
  labelBackgroundColorFocused,
  defaultValue,
  inputValue,
  icon,
  isPicker,
  isPickerVisible,
  disabled,
}) => {
  const styledTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [isStyledInputFocused, setIsStyledInputFocused] =
    useState<boolean>(false);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    setHasText(event.target.value.trim() !== "");
  };

  // useEffect(() => {
  //   const handleDocumentClick = (event: MouseEvent) => {
  //     // console.log(styledInputRef.current === document.activeElement);
  //     setIsStyledInputFocused(
  //       styledInputRef.current === document.activeElement
  //     );
  //   };

  //   document.addEventListener("click", handleDocumentClick);

  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, [styledInputRef]);

  // useEffect(() => {
  //   const handleDocumentClick = () => {
  //     setIsStyledInputFocused(
  //       styledInputRef.current === document.activeElement
  //     );
  //   };

  //   document.addEventListener("click", handleDocumentClick);

  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, [styledInputRef]);

  // useEffect(() => {
  //   if (inputValue) {
  //     setDefaultValueTest(inputValue);
  //   } else {
  //     setHasText(false);
  //   }
  // }, [inputValue]);

  // useEffect(() => {
  //   console.log("defaultValueTest", defaultValueTest);
  // }, [defaultValueTest, inputValue]);

  // useEffect(() => {
  //   console.log(ref?.current);
  // }, [ref]);
  return (
    <div className="w-full flex">
      {/* <div className="input-group">
        <input type="text" required />
        <label htmlFor="">username</label>
      </div> */}

      <div className="w-full relative cursor-pointer">
        <textarea
          rows={25}
          cols={5}
          ref={styledTextAreaRef}
          className={`resize-none ${
            styledInputWidth ? styledInputWidth : "w-72"
          } h-72 ${
            textColor ? textColor : "text-black"
          } text-base cursor-pointer ${
            textColorUnfocused ? textColorUnfocused : "text-black"
          }  ${
            textColorFocused ? textColorFocused : "text-black"
          }  p-2 bg-transparent border  ${
            borderColorUnfocused ? borderColorUnfocused : "border-black"
          } ${
            borderColorFocused ? borderColorFocused : "focus:border-gray-300"
          }  outline-none rounded-lg  transition-all duration-200 ${
            focused || hasText || inputValue ? "border-gray-300" : ""
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={name}
          onChange={(event) => {
            handleInputChange(event);
            onChangeStyledInput(event);
          }}
          value={inputValue}
          defaultValue={defaultValue}
          onClick={onClickInput}
          autoComplete="off"
          required
          disabled={disabled}
        />

        <label
          htmlFor=""
          className={`absolute left-2 ${
            labelColor ? labelColor : "text-black"
          } transform ${
            focused || hasText || inputValue
              ? `-translate-y-2 text-xs`
              : `translate-y-2`
          } ${labelUnfocused ? labelUnfocused : "text-black"} ${
            focused ? `!${labelFocused}` : "text-black"
          }  px-1 pointer-events-none ${
            labelBackgroundColorUnfocused
              ? labelBackgroundColorUnfocused
              : "bg-gray-50"
          } ${
            focused && labelBackgroundColorFocused
            // focused && "!bg-red-700"
          } transition-all duration-200`}
        >
          {label}
        </label>
        {/* <span
          className="absolute right-2 top-2.5 text-xl"
          onClick={() => {
            if (!disabled) {
              if (isPicker) {
                if (isPickerVisible) {
                  styledInputRef.current?.blur();
                  if (typeof onClickInput === "function") onClickInput();
                } else {
                  styledInputRef.current?.focus();
                  if (typeof onClickInput === "function") onClickInput();
                }
              } else {
                if (isStyledInputFocused) {
                  styledInputRef.current?.blur();
                } else styledInputRef.current?.focus();
              }
            }
          }}
        >
          {icon}
        </span> */}
      </div>
    </div>
  );
};
