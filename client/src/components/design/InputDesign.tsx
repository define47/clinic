import { FC, useState } from "react";

export const InputDesign: FC = () => {
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

  const handleInputChange = (event: any) => {
    setHasText(event.target.value.trim() !== "");
  };

  return (
    <div>
      {/* <div className="input-group">
        <input type="text" required />
        <label htmlFor="">username</label>
      </div> */}

      <div className="relative mt-20">
        <input
          type="text"
          className={`w-80 h-10 text-base text-black p-2 bg-transparent border border-black outline-none rounded-md focus:border-gray-300 transition-all duration-200 ${
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
            focused || hasText ? "-translate-y-2 text-xs" : "translate-y-2"
          } text-black px-1 pointer-events-none bg-white transition-all duration-200`}
        >
          Username
        </label>
      </div>
    </div>
  );
};
