import { ChangeEvent, ChangeEventHandler, FC, useRef } from "react";

type UnderlinedTextAreaProps = {
  name: string;
  underlinedTextAreaInput: string;
  onChangeUnderlinedTextAreaInput: ChangeEventHandler<HTMLTextAreaElement>;
};

export const UnderlinedTextArea: FC<UnderlinedTextAreaProps> = ({
  underlinedTextAreaInput,
  onChangeUnderlinedTextAreaInput,
  name,
}) => {
  const underlinedTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (underlinedTextAreaRef.current) {
      underlinedTextAreaRef.current.style.height = "auto";
      underlinedTextAreaRef.current.style.height = `${e.target.scrollHeight}px`; //- 16
    }
  };

  return (
    <textarea
      ref={underlinedTextAreaRef}
      className="w-full underlined-textarea resize-none outline-none overflow-hidden"
      rows={5}
      // cols={5}
      value={underlinedTextAreaInput}
      onChange={(event) => {
        onChangeUnderlinedTextAreaInput(event);
        handleInput(event);
      }}
      name={name}
      autoComplete="off"
      required
    ></textarea>
  );
};
