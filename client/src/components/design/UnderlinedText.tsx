import { FC } from "react";
import { UnderlinedTextProps } from "../../types";

export const UnderlinedText: FC<UnderlinedTextProps> = ({
  text,
  textColor,
  underlineColorGradientStart,
  underlineColorGradientEnd,
}) => {
  return (
    <div
      className={`group ${textColor} transition-all duration-300 ease-in-out`}
    >
      <span
        className={`bg-left-bottom bg-gradient-to-r ${underlineColorGradientStart} ${underlineColorGradientEnd} cursor-pointer bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out`}
      >
        {text}
      </span>
    </div>
  );
};
