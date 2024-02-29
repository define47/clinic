import { FC, useEffect, useState } from "react";

export const RichTextEditor: FC = () => {
  const [content, setContent] = useState<string>("Type here...");

  //   const handleInputChange = (e) => {
  //     setContent(e.target.innerHTML);
  //   };

  //   const execCommand = (command, arg) => {
  //     document.execCommand(command, false, arg);
  //   };

  const toggleStyles = (command) => {
    document.execCommand(command, false, null);
  };

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <>
      <button className="text-green-500" onClick={() => toggleStyles("bold")}>
        Bold
      </button>
      <div
        className="outline-none border border-gray-500"
        contentEditable
        onInput={(event) => {
          if (event.currentTarget.textContent)
            setContent(event.currentTarget.textContent);
        }}
      ></div>
    </>
    // <div>
    //   <div
    //     contentEditable="true"
    //     id="myEditor"
    //     className="editor"
    //     onInput={handleInputChange}
    //     dangerouslySetInnerHTML={{ __html: content }}
    //   />
    //   <br />
    //   <button className="text-green-500" onClick={() => toggleStyles("bold")}>
    //     Bold
    //   </button>
    //   <button className="text-green-500" onClick={() => toggleStyles("italic")}>
    //     Italic
    //   </button>
    //   <button
    //     className="text-green-500"
    //     onClick={() => toggleStyles("underline")}
    //   >
    //     Underline
    //   </button>
    //   <button
    //     className="text-green-500"
    //     onClick={() => execCommand("insertUnorderedList")}
    //   >
    //     Bullet Points
    //   </button>
    // </div>
  );
};
