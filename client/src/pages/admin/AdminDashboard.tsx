import { FC, useState } from "react";
import { StyledRippleButton } from "../../components/design/StyledRippleButton";
import ModalOverlay from "../../components/overlays/ModalOverlay";

export const AdminDashboard: FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => {
    setModalOpen(!modalOpen);
  };
  return (
    <div className="">
      {/* admin dashboard <Overlay /> */}
      <div className="space-y-10">
        {/* <StyledInput
          label="label1"
          textColorUnfocused="text-red-500"
          textColorFocused="focus:text-red-500"
          borderColorUnfocused="border-red-500"
          borderColorFocused="focus:border-red-500"
          labelUnfocused="text-red-500"
          labelFocused="text-red-500"
        />
        <StyledInput
          label="label2"
          textColorUnfocused="text-green-500"
          textColorFocused="focus:text-green-500"
          borderColorUnfocused="border-green-500"
          borderColorFocused="focus:border-green500"
          labelUnfocused="text-green-500"
          labelFocused="text-green-500"
        /> */}
        <StyledRippleButton
          onClick={() => console.log("Button Clicked")}
          label="label"
          type="create"
        />
        <button onClick={handleModal}>Open Modal</button>

        {/* {modalOpen && <Modal closeModal={() => setModalOpen(false)} />} */}

        {modalOpen && (
          <ModalOverlay closeModal={() => setModalOpen(false)}>
            <>
              <h3>Modal2</h3>
              <p>Modal here</p>
            </>
          </ModalOverlay>
        )}
      </div>
    </div>
  );
};
