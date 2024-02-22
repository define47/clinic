import { FC, useEffect, useState } from "react";
import { DeleteMedicalSpecialityOverlayPros } from "../../../types";
import { medicalSpecialitiesPath } from "../../../utils/dotenv";
import axios from "axios";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";
import { IoTrashOutline, IoTrashSharp } from "react-icons/io5";
import { Tooltip } from "../../design/Tooltip";

export const DeleteMedicalSpecialityOverlay: FC<
  DeleteMedicalSpecialityOverlayPros
> = ({ medicalSpeciality }) => {
  const [
    isDeleteMedicalSpecialityConfirmationDialogOverlayVisible,
    setIsDeleteMedicalSpecialityConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);

  async function onDeleteMedicalSpeciality() {
    try {
      const response = await axios.delete(medicalSpecialitiesPath, {
        data: { medicalSpecialityId: medicalSpeciality.medicalSpecialityId },
        withCredentials: true,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function handleCloseOverlayEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDeleteMedicalSpecialityConfirmationDialogOverlayVisible(false);
      }
    }

    document.addEventListener("keydown", handleCloseOverlayEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleCloseOverlayEscapeKey);
    };
  }, [isDeleteMedicalSpecialityConfirmationDialogOverlayVisible]);
  return (
    <div>
      {isDeleteMedicalSpecialityConfirmationDialogOverlayVisible ? (
        <IoTrashSharp className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text="Delete Appointment">
          <IoTrashOutline
            onClick={() =>
              setIsDeleteMedicalSpecialityConfirmationDialogOverlayVisible(true)
            }
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}
      <ConfirmationDialogOverlay
        className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
          isDeleteMedicalSpecialityConfirmationDialogOverlayVisible
            ? "visible"
            : "invisible"
        }`}
        closeConfirmationDialogModal={() =>
          setIsDeleteMedicalSpecialityConfirmationDialogOverlayVisible(false)
        }
      >
        <div
          className={`w-1/3 h-1/4 bg-lightMode-overlayBackgroundColor dark:bg-darkMode-overlayBackgroundColor border border-gray-500 flex transition-all rounded-xl ${
            isDeleteMedicalSpecialityConfirmationDialogOverlayVisible
              ? "scale-100 opacity-100 duration-200"
              : "scale-125 opacity-0 duration-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col p-4">
            <span className="w-full flex justify-center mb-8 dark:text-gray-500">
              Are you sure want to delete the Speciality{" "}
              {medicalSpeciality.medicalSpecialityName}?
            </span>
            <div>
              <div>{medicalSpeciality.medicalSpecialityId}</div>
            </div>
            <div className="w-full flex justify-between">
              <StyledRippleButton
                label="Yes"
                type="yes"
                onClick={onDeleteMedicalSpeciality}
              />
              <StyledRippleButton
                label="No"
                type="delete"
                onClick={() =>
                  setIsDeleteMedicalSpecialityConfirmationDialogOverlayVisible(
                    false
                  )
                }
              />
            </div>
          </div>
        </div>
      </ConfirmationDialogOverlay>
    </div>
  );
};
