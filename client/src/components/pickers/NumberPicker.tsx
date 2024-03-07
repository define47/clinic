import { FC, useEffect, useRef, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { VscDash } from "react-icons/vsc";

export const NumberPicker: FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [caretIndex, setCaretIndex] = useState<number>(-1);

  useEffect(() => {
    // setItems(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."]);
    setItems(["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "del"]);
  }, []);

  useEffect(() => {
    console.log("price", price);
  }, [price]);

  const cursorPosition = () => {
    const sel = window.getSelection();
    if (sel) {
      // Use sel.focusOffset to get the caret position
      const pos = sel.focusOffset;

      // Collapse to the end of the selection
      if (sel.anchorNode !== undefined) sel.collapseToEnd();

      return pos;
    }
    return -1; // Return -1 if there is no selection
  };

  const printCaretPosition = () => {
    const caretPos = cursorPosition();
    const trimmedTextLength =
      contentEditableRef.current.textContent.trim().length;

    console.log(caretPos, "length:", trimmedTextLength);

    // Update the caretIndex state
    setCaretIndex(caretPos);
  };

  useEffect(() => {
    const div = contentEditableRef.current;

    if (div) {
      div.addEventListener("click", printCaretPosition);
      div.addEventListener("keydown", printCaretPosition);

      return () => {
        div.removeEventListener("click", printCaretPosition);
        div.removeEventListener("keydown", printCaretPosition);
      };
    }
  }, [contentEditableRef]);

  useEffect(() => {
    console.log("caretIndex", caretIndex);
  }, [caretIndex]);

  return (
    <div className="relative">
      <div className="w-full h-16 flex items-center justify-center space-x-2 bg-white border rounded-tl-xl rounded-tr-xl">
        <div className="w-11 h-11 flex items-center justify-center bg-gray-300 rounded-lg">
          <VscDash className="text-2xl" />
        </div>
        <div
          ref={contentEditableRef}
          className="w-20 flex items-center justify-center text-pink-500 outline-none"
          contentEditable
          onInput={(event) => {
            if (event.currentTarget.textContent)
              setPrice(event.currentTarget.textContent);
          }}
        >
          {/* {price} */}
        </div>
        <div className="w-11 h-11 flex items-center justify-center bg-gray-300 rounded-lg">
          <RiAddLine className="text-lg" />
        </div>
      </div>
      <div className="absolute top-16 left-0 w-full grid grid-cols-3 text-lg">
        {items.map((item: string) => (
          <span
            className={`w-16 h-16 flex items-center justify-center bg-white ${
              (item === "1" || item === "3" || item === "7" || item === "9") &&
              "border"
            } ${(item === "2" || item === "8") && "border-y"} ${
              (item === "4" || item === "6") && "border-x"
            } ${item === "del" && "border-x border-b rounded-br-xl"} ${
              item === "." && "border-x border-b rounded-bl-xl"
            } ${item === "0" && "border-b"} border-gray-300`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
