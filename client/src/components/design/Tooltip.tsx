import { FC, ReactNode, useState } from "react";

type TooltipProps = {
  text: string;
  children: ReactNode;
};

export const Tooltip: FC<TooltipProps> = ({ text, children }) => {
  const [isCursorOn, setIsCursorOn] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        onMouseEnter={() => setIsCursorOn(true)}
        onMouseLeave={() => setIsCursorOn(false)}
      >
        {children}
      </div>

      <div
        className={`w-40 absolute z-50 top-6 right-0 flex items-center justify-center transition-all bg-black text-white rounded-xl text-xs ${
          isCursorOn ? "opacity-100 p-2 duration-300" : "opacity-0 duration-300"
        } `}
      >
        <span className="">{text}</span>
      </div>
    </div>
  );
};
