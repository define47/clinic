import React, { FC, useRef } from "react";

export interface StyledRippleButton {
  onClick: () => void;
  label: string;
  type: string;
  isDisabled?: boolean;
}

export const StyledRippleButton: FC<StyledRippleButton> = ({
  onClick,
  label,
  type,
  isDisabled,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const left = event.clientX - rect.left - diameter / 2;
      const top = event.clientY - rect.top - diameter / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;

      buttonRef.current.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });

      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${
        type === "create"
          ? "bg-blue-400 dark:bg-blue-800"
          : type === "delete"
          ? "bg-red-400"
          : type === "yes"
          ? "bg-green-400"
          : ""
      } w-36 h-10 rounded-full text-white ${
        type === "create"
          ? "hover:bg-blue-700"
          : type === "delete"
          ? "hover:bg-red-700"
          : type === "yes"
          ? "hover:bg-green-700"
          : ""
      } ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};
