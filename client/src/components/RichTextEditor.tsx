import { FC, useEffect, useState } from "react";

export const RichTextEditor: FC = () => {
  const [content, setContent] = useState<string>("");

  // function isBold() {
  //   const selection = window.getSelection();
  //   if (selection) {
  //     const range = selection.getRangeAt(0);
  //     const parentElement = range.commonAncestorContainer.parentElement;
  //     console.log(parentElement);

  //     console.log(
  //       "isBold",
  //       parentElement && parentElement.nodeName === "STRONG"
  //     );

  //     return parentElement && parentElement.nodeName === "STRONG";
  //   }
  //   return false;
  // }

  function isBold(node: Node) {
    return (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName === "STRONG"
    );
  }

  // function onBold() {
  //   const selection = window.getSelection();
  //   const range = selection?.getRangeAt(0);

  //   if (range) {
  //     const isTextBold = isBold();
  //     if (isTextBold) {
  //       const parentElement = range.commonAncestorContainer.parentElement;
  //       console.log("parentElement", parentElement);

  //       if (parentElement) {
  //         // Replace the <strong> element with its text content
  //         const textNode = document.createTextNode(
  //           parentElement.textContent || ""
  //         );
  //         parentElement.replaceWith(textNode);
  //       }
  //     } else {
  //       const selectedText = range.toString();
  //       const strongElement = document.createElement("strong");
  //       strongElement.appendChild(document.createTextNode(selectedText));

  //       range.deleteContents();
  //       range.insertNode(strongElement);
  //     }
  //   }

  //   console.log("selection", selection?.toString());
  //   console.log("range", range?.toString());
  // }

  // function toggleBold() {
  //   const selection = window.getSelection();
  //   if (selection) {
  //     const range = selection.getRangeAt(0);
  //     const selectedText = range.toString();

  //     if (selectedText) {
  //       // Split the range into a start node, selected nodes, and an end node
  //       const [startNode, endNode] = [range.startContainer, range.endContainer];
  //       const nodesToToggle: Node[] = [];

  //       let currentNode = startNode;

  //       // Traverse the range and collect the nodes to toggle
  //       while (currentNode && currentNode !== endNode.nextSibling) {
  //         nodesToToggle.push(currentNode);
  //         currentNode = currentNode.nextSibling || currentNode.parentElement?.nextSibling;
  //       }

  //       // Toggle the bold state for each collected node
  //       nodesToToggle.forEach((node) => {
  //         if (isBold(node)) {
  //           // Remove bold style
  //           const textNode = document.createTextNode(node.textContent || "");
  //           node.replaceWith(textNode);
  //         } else {
  //           // Apply bold style
  //           const strongElement = document.createElement("strong");
  //           strongElement.appendChild(document.createTextNode(node.textContent || ""));
  //           node.replaceWith(strongElement);
  //         }
  //       });
  //     }
  //   }
  // }

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <>
      {/* <button className="text-black" onClick={toggleBold}>/
        B
      </button> */}
      <div
        className="outline-none border border-gray-500"
        contentEditable
        onInput={(event) => {
          if (event.currentTarget.textContent)
            setContent(event.currentTarget.textContent);
        }}
      >
        abcdefghijklmnopqrst
        <strong>here</strong>
      </div>
    </>
  );
};

// import { FC, useEffect, useState } from "react";

// export const RichTextEditor: FC = () => {
//   const [content, setContent] = useState<string>("");

//   useEffect(() => {
//     console.log("content", content);
//   }, [content]);

//   const execCommand = (command, arg) => {
//     document.execCommand(command, false, arg);
//   };

//   const toggleStyles = (command) => {
//     document.execCommand(command, false, null);
//   };

//   const getHtmlContent = () => {
//     const editableDiv = document.getElementById("editableDiv");
//     if (editableDiv) {
//       console.log("HTML Content:", editableDiv.innerHTML);
//       // You can save the HTML content or use it as needed
//     }
//   };

//   return (
//     <>
//       <div className="flex space-x-4">
//         <button className="text-black" onClick={() => toggleStyles("bold")}>
//           Bold
//         </button>
//         <button className="text-black" onClick={() => toggleStyles("italic")}>
//           Italic
//         </button>
//         <button
//           className="text-black"
//           onClick={() => toggleStyles("underline")}
//         >
//           Underline
//         </button>
//         <button
//           className="text-black"
//           onClick={() => execCommand("insertUnorderedList")}
//         >
//           Bullet Points
//         </button>
//       </div>
//       <div
//         id="editableDiv"
//         className="outline-none border border-gray-500"
//         contentEditable
// onInput={(event) => {
//   if (event.currentTarget.textContent)
//     setContent(event.currentTarget.textContent);
// }}
//       ></div>
//       <button className="text-black mt-4" onClick={getHtmlContent}>
//         Get HTML Content
//       </button>
//     </>
//   );
// };
