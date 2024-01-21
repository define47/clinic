import { FC } from "react";

export const InputDesign: FC = () => {
  return (
    <div>
      <div className="input-group">
        <input type="text" required />
        <label htmlFor="">username</label>
      </div>

      <div className="input-group relative my-5">
        <input
          type="text"
          className="w-80 h-10 text-base text-black p-2 bg-transparent border border-black outline-none rounded-md"
          required
        />
        <label
          htmlFor=""
          className="absolute top-2 left-2 text-base text-black px-1 bg-gray-50 pointer-events-none transition-all duration-200"
        >
          Username
        </label>
      </div>
    </div>
  );
};
