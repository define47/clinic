import axios from "axios";
import { FC, useEffect, useState } from "react";
import { DeleteMedicalProcedureOverlayProps } from "../../../types";
import { Tooltip } from "../../design/Tooltip";
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { medicalProceduresAPI } from "../../../utils/dotenv";
import { Toaster, toast } from "sonner";

export const DeleteMedicalProcedureOverlay: FC<
  DeleteMedicalProcedureOverlayProps
> = ({ medicalSpecialityId, medicalProcedure }) => {
  const [
    isDeleteMedicalProcedureConfirmationDialogOverlayVisible,
    setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [isDeleteMedicalProcedureConfirmationDialogOverlayVisible]);

  async function onDeleteMedicalProcedure() {
    try {
      const response = await axios.delete(medicalProceduresAPI, {
        data: {
          medicalSpecialityId: medicalSpecialityId.substring(1),
          medicalProcedureId: medicalProcedure.medicalProcedureId,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      {isDeleteMedicalProcedureConfirmationDialogOverlayVisible ? (
        <IoTrashSharp className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Delete Medical Procedure`}>
          <IoTrashOutline
            onClick={() =>
              setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible(true)
            }
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <ConfirmationDialogOverlay
        className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
          isDeleteMedicalProcedureConfirmationDialogOverlayVisible
            ? "visible"
            : "invisible"
        }`}
        closeConfirmationDialogModal={() =>
          setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible(false)
        }
      >
        <div
          className={`w-1/3 h-1/4 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 flex transition-all rounded-xl ${
            isDeleteMedicalProcedureConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col p-4">
            <span className="w-full flex justify-center mb-8 dark:text-gray-500">
              Are you sure want to delete the Medical Procedure?
            </span>
            <div>
              <div>{medicalProcedure.medicalProcedureId}</div>
            </div>
            <div className="w-full flex justify-between">
              <StyledRippleButton
                label="Yes"
                type="yes"
                onClick={onDeleteMedicalProcedure}
              />
              <StyledRippleButton
                label="No"
                type="delete"
                onClick={() =>
                  setIsDeleteMedicalProcedureConfirmationDialogOverlayVisible(
                    false
                  )
                }
              />
            </div>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </ConfirmationDialogOverlay>
    </div>
  );
};
