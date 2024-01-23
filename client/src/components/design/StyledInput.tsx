import { ChangeEventHandler, FC, useEffect, useState } from "react";

type StyledInputProps = {
  label: string;
  name: string;
  onChangeStyledInput: ChangeEventHandler<HTMLInputElement>;
  textColorUnfocused?: string;
  textColorFocused?: string;
  borderColorUnfocused?: string;
  borderColorFocused?: string;
  labelUnfocused?: string;
  labelFocused?: string;
  labelBackgroundColor?: string;
  defaultValue?: string;
  inputValue?: string;
};

export const StyledInput: FC<StyledInputProps> = ({
  label,
  name,
  onChangeStyledInput,
  textColorUnfocused,
  textColorFocused,
  borderColorUnfocused,
  borderColorFocused,
  labelUnfocused,
  labelFocused,
  labelBackgroundColor,
  defaultValue,
  inputValue,
}) => {
  const [focused, setFocused] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [defaultValueTest, setDefaultValueTest] = useState<string>(inputValue!);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    setHasText(event.target.value.trim() !== "");
  };

  useEffect(() => {
    if (inputValue) {
      setDefaultValueTest(inputValue);
    } else {
      setHasText(false);
    }
  }, [inputValue]);

  useEffect(() => {
    console.log("defaultValueTest", defaultValueTest);
  }, [defaultValueTest, inputValue]);
  return (
    <div>
      {/* <div className="input-group">
        <input type="text" required />
        <label htmlFor="">username</label>
      </div> */}

      <div className="relative">
        <input
          type="text"
          className={`w-80 h-10 text-base ${
            textColorUnfocused ? textColorUnfocused : "text-black"
          }  ${
            textColorFocused ? textColorFocused : "text-black"
          }  p-2 bg-transparent border ${
            borderColorUnfocused ? borderColorUnfocused : "border-black"
          } ${
            borderColorFocused ? borderColorFocused : "focus:border-gray-300"
          }  outline-none rounded-md  transition-all duration-200 ${
            focused || hasText || defaultValueTest ? "border-gray-300" : ""
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={name}
          onChange={(event) => {
            handleInputChange(event);
            onChangeStyledInput(event);
          }}
          value={defaultValueTest}
          defaultValue={defaultValue}
          required
        />
        <label
          htmlFor=""
          className={`absolute left-2 transform ${
            focused || hasText || defaultValueTest
              ? `-translate-y-2 text-xs`
              : `translate-y-2`
          } ${labelUnfocused ? labelUnfocused : "text-black"} ${
            focused ? `!${labelFocused}` : "text-black"
          }  px-1 pointer-events-none ${
            labelBackgroundColor ? labelBackgroundColor : "bg-gray-50"
          } transition-all duration-200`}
        >
          {label} {defaultValueTest}
        </label>
      </div>
    </div>
  );
};
