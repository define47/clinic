import { FC, useEffect, useRef, useState } from "react";
import { StyledInput } from "../design/StyledInput";
import { RiArrowUpSLine } from "react-icons/ri";
import { LimitPickerProps } from "../../types";

export const LimitPicker: FC<LimitPickerProps> = ({
  selectedLimit,
  setSelectedLimit,
}) => {
  const [limits, setLimits] = useState<number[]>([]);
  // const [selectedLimit, setSelectedLimit] = useState<string>("5");
  const [isLimitPickerVisible, setIsLimitPickerVisible] =
    useState<boolean>(false);
  const limitPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLimits([5, 10, 15, 20, 25, 50, 100]);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        limitPickerRef.current &&
        !limitPickerRef.current.contains(event.target as Node)
      ) {
        setIsLimitPickerVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLimitPickerVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLimitPickerVisible]);

  function handleLimitClick(limit: number) {
    setSelectedLimit(limit);
    setIsLimitPickerVisible(false);
  }

  return (
    <div className="flex">
      <div className="relative z-50" ref={limitPickerRef}>
        <StyledInput
          label="Limit Picker"
          inputValue={selectedLimit.toString()}
          name="limitPicker"
          onChangeStyledInput={(event) => {
            // setSelectedLimit(event.target.value);
            setIsLimitPickerVisible(true);
          }}
          onClickInput={() => {
            setIsLimitPickerVisible(!isLimitPickerVisible);
          }}
          icon={
            <div
              className={`transition-transform transform ${
                !isLimitPickerVisible ? "rotate-0" : "rotate-180"
              }`}
            >
              <RiArrowUpSLine
                onClick={() => {
                  setIsLimitPickerVisible(!isLimitPickerVisible);
                }}
              />
            </div>
          }
          isPicker={true}
          isPickerVisible={isLimitPickerVisible}
          disabled
        />
        <ul
          className={`absolute w-full bg-white overflow-y-auto h-40 ${
            isLimitPickerVisible
              ? "opacity-100 duration-500 border border-gray-300 rounded-lg"
              : "opacity-0 duration-500 pointer-events-none"
          }`}
        >
          {limits.map((limit: number) => (
            <li
              className="p-2 text-left text-sm transition duration-200 ease-in-out hover:bg-pink-200 cursor-pointer border-b border-gray-300"
              key={limit}
              onClick={() => handleLimitClick(limit)}
            >
              {limit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
