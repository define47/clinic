import { FC, MouseEvent, useState } from "react";
import { RiMailSendFill, RiMailSendLine } from "react-icons/ri";
import { Email, SendEmailOverlayProps } from "../../../types";
import { Tooltip } from "../../design/Tooltip";
import Overlay from "../base/Overlay";
import { StyledTextArea } from "../../design/StyledTextArea";
import { StyledRippleButton } from "../../design/StyledRippleButton";
import { ConfirmationDialogOverlay } from "../base/ConfirmationDialogOverlay";

export const SendEmailOverlay: FC<SendEmailOverlayProps> = ({
  patientEmail,
}) => {
  const [isSendEmailOverlayVisible, setIsSendEmailOverlayVisible] =
    useState<boolean>(false);
  const [
    isSendEmailConfirmationDialogOverlayVisible,
    setIsSendEmailConfirmationDialogOverlayVisible,
  ] = useState<boolean>(false);
  const [emailToSend, setEmailToSend] = useState<Email>({
    recipientEmail: "",
    subject: "",
    html: "",
  });

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the overlay if the click is outside the content
    if (e.target === e.currentTarget) {
      setIsSendEmailOverlayVisible(false);
    }
  };

  return (
    <>
      {isSendEmailOverlayVisible ? (
        <RiMailSendFill className="text-xl text-lightMode-sidebarItemIconColor scale-125" />
      ) : (
        <Tooltip text={`Send Email`}>
          <RiMailSendLine
            onClick={() => setIsSendEmailOverlayVisible(true)}
            className="text-xl cursor-pointer hover:text-lightMode-sidebarItemIconColor hover:scale-125"
          />
        </Tooltip>
      )}

      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-40  ${
          isSendEmailOverlayVisible ? "visible backdrop-blur-sm" : "invisible"
        }`}
        // closeModal={() => setIsUpdateUserOverlayVisible(false)}
        closeModal={handleOverlayClick}
      >
        <div
          className={`bg-white border border-gray-500 w-2/3 h-1/2 rounded-xl shadow p-6 transition-all ${
            isSendEmailOverlayVisible
              ? "scale-100 opacity-100 duration-500"
              : "scale-125 opacity-0 duration-500"
          }`}
          // onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* <MedicalProcedurePicker /> */}
            <StyledTextArea
              label="testLabel"
              name="test"
              onChangeStyledInput={() => {}}
            />
          </div>
          <div className="w-full mt-14 flex justify-between">
            <StyledRippleButton
              label="Continue"
              type="create"
              onClick={() =>
                setIsSendEmailConfirmationDialogOverlayVisible(true)
              }
            />

            <StyledRippleButton
              label="Cancel"
              type="delete"
              onClick={() => setIsSendEmailOverlayVisible(false)}
            />

            <ConfirmationDialogOverlay
              className={`fixed inset-0 flex justify-center items-center bg-black/20 transition-all z-50  ${
                isSendEmailConfirmationDialogOverlayVisible
                  ? "visible backdrop-blur-sm"
                  : "invisible"
              }`}
              closeConfirmationDialogModal={() =>
                setIsSendEmailConfirmationDialogOverlayVisible(false)
              }
            >
              <div
                className={`w-96 h-96 bg-white flex items-center justify-center transition-all ${
                  isSendEmailConfirmationDialogOverlayVisible
                    ? "scale-100 opacity-100 duration-200"
                    : "scale-125 opacity-0 duration-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <StyledRippleButton
                  label="Update"
                  type="yes"
                  onClick={() => {}}
                />
                <StyledRippleButton
                  label="Cancel"
                  type="delete"
                  onClick={() =>
                    setIsSendEmailConfirmationDialogOverlayVisible(false)
                  }
                />
              </div>
            </ConfirmationDialogOverlay>
          </div>
        </div>
      </Overlay>
    </>
  );
};
