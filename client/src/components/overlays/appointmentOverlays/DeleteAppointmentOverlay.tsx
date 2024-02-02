import axios from "axios";
import { FC, useEffect, useState } from "react";
import { appointmentsPath } from "../../../utils/dotenv";
import { DeleteAppointmentOverlayPros } from "../../../types";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5";
import { Tooltip } from "../../design/Tooltip";

export const DeleteAppointmentOverlay: FC<DeleteAppointmentOverlayPros> = ({
  appointmentId,
}) => {
  const [
    isDeleteAppointmentConfirmationDialogOverlayVisible,
    setIsDeleteAppointmentConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDeleteAppointmentConfirmationDialogOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [isDeleteAppointmentConfirmationDialogOverlayVisible]);

  async function onDeleteAppointment() {
    try {
      const response = await axios.delete(appointmentsPath, {
        data: { appointmentId },
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {isDeleteAppointmentConfirmationDialogOverlayVisible ? (
        <IoTrashSharp className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text="Delete Appointment">
          <IoTrashOutline
            onClick={() =>
              setIsDeleteAppointmentConfirmationDialogOverlayVisible(true)
            }
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <ConfirmationDialogOverlay
        className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
          isDeleteAppointmentConfirmationDialogOverlayVisible
            ? "visible backdrop-blur-sm"
            : "invisible"
        }`}
        closeConfirmationDialogModal={() =>
          setIsDeleteAppointmentConfirmationDialogOverlayVisible(false)
        }
      >
        <div
          className={`w-1/3 h-1/4 bg-white flex transition-all rounded-xl ${
            isDeleteAppointmentConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col p-4">
            <span className="w-full flex justify-center mb-8">
              Are you sure want to delete the Appointment?
            </span>
            <div>
              <div>{appointmentId}</div>
            </div>
            <div className="w-full flex justify-between">
              <StyledRippleButton
                label="Yes"
                type="yes"
                onClick={onDeleteAppointment}
              />
              <StyledRippleButton
                label="No"
                type="delete"
                onClick={() =>
                  setIsDeleteAppointmentConfirmationDialogOverlayVisible(false)
                }
              />
            </div>
          </div>
        </div>
      </ConfirmationDialogOverlay>
    </div>
  );
};
