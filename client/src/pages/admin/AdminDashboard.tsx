import { FC } from "react";
import { Overlay } from "../../components/overlays/Overlay";
import { InputDesign } from "../../components/design/InputDesign";

export const AdminDashboard: FC = () => {
  return (
    <div className="">
      admin dashboard <Overlay />
      <InputDesign />
    </div>
  );
};
