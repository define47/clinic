import { FC, useState } from "react";

type InputDesignProps = {
  label: string;
  textColorUnfocused?: string;
  textColorFocused?: string;
  borderColorUnfocused?: string;
  borderColorFocused?: string;
  labelUnfocused?: string;
  labelFocused?: string;
};

export const InputDesign: FC<InputDesignProps> = ({
  label,
  textColorUnfocused,
  textColorFocused,
  borderColorUnfocused,
  borderColorFocused,
  labelUnfocused,
  labelFocused,
}) => {
  const [focused, setFocused] = useState(false);
  const [hasText, setHasText] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (!hasText) {
      setFocused(false);
    }
  };

  const handleInputChange = (event: { target: { value: string } }) => {
    setHasText(event.target.value.trim() !== "");
  };

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
            focused || hasText ? "border-gray-300" : ""
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          required
        />
        <label
          htmlFor=""
          className={`absolute left-2 transform ${
            focused || hasText ? `-translate-y-2 text-xs` : `translate-y-2`
          } ${labelUnfocused ? labelUnfocused : "text-black"} ${
            focused ? `!${labelFocused}` : "text-black"
          }  px-1 pointer-events-none bg-gray-50 transition-all duration-200`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};
