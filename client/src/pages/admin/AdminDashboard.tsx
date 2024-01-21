import { FC } from "react";
import { Overlay } from "../../components/overlays/Overlay";
import { InputDesign } from "../../components/design/InputDesign";

export const AdminDashboard: FC = () => {
  return (
    <div className="">
      admin dashboard <Overlay />
      <div className="space-y-10">
        <InputDesign
          textColorUnfocused="text-green-500"
          textColorFocused="focus:text-red-500"
          borderColorUnfocused="border-green-500"
          borderColorFocused="focus:border-red-500"
          labelUnfocused="text-green-500"
          labelFocused="text-red-500"
        />
        <InputDesign
          textColorUnfocused="text-green-500"
          textColorFocused="focus:text-green-500"
          borderColorUnfocused="border-green-500"
          borderColorFocused="focus:border-green500"
          labelUnfocused="text-green-500"
          labelFocused="text-green-500"
        />
      </div>
    </div>
  );
};
