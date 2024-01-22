// import { FC, useState } from "react";

// export const Overlay: FC = () => {
//   const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);

//   return (
//     <div>
//       <button onClick={() => setIsOverlayVisible(true)}>open</button>
//       <div
//         className={`fixed inset-0 flex justify-center items-center transition-colors ${
//           isOverlayVisible ? "visible bg-black/20" : "invisible"
//         }`}
//       >
//         <div
//           className={`bg-white w-2/3 h-2/3 rounded-xl shadow p-6 transition-all ${
//             isOverlayVisible
//               ? "scale-100 opacity-100 duration-1000"
//               : "scale-125 opacity-0 duration-1000"
//           }`}
//         >
//           <input />
//           <button onClick={() => setIsOverlayVisible(false)}>close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

type OverlayProps = {
  closeModal: () => void;
  children: ReactNode;
  className: string;
};

const Overlay: FC<OverlayProps> = ({ className, closeModal, children }) => {
  const portalRoot = document.getElementById("overlay");

  return createPortal(
    <div className={className} onClick={closeModal}>
      {children}
    </div>,
    portalRoot!
  );
};

export default Overlay;
