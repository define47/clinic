// import React, { useState } from "react";

import { FC, useEffect, useState } from "react";

// interface TreeNode {
//   name: string;
//   children?: TreeNode[];
// }

// interface TreeTableProps {
//   data: TreeNode[];
// }

// const TreeTable: React.FC<TreeTableProps> = ({ data }) => {
//   const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

//   const toggleNode = (nodeName: string) => {
//     setExpandedNodes((prevExpanded) =>
//       prevExpanded.includes(nodeName)
//         ? prevExpanded.filter((node) => node !== nodeName)
//         : [...prevExpanded, nodeName]
//     );
//   };

//   const renderTree = (nodes: TreeNode[] | undefined) => {
//     if (!nodes) return null;

//     return nodes.map((node) => (
//       <React.Fragment key={node.name}>
//         <tr>
//           <td>
//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => toggleNode(node.name)}
//             >
//               {expandedNodes.includes(node.name) ? "[-]" : "[+]"}
//              {node.name}
//             </span>
//             <table>
//               <thead>
//                 <tr>
//                   <th>c1</th>
//                   <th>c2</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>{node.name}</td>
//                   <td>c2</td>
//                 </tr>
//               </tbody>
//             </table>
//           </td>
//         </tr>
//         {expandedNodes.includes(node.name) && (
//           <tr>
//             <td style={{ paddingLeft: "20px" }}>{renderTree(node.children)}</td>
//           </tr>
//         )}
//       </React.Fragment>
//     ));
//   };

//   return (
//     <table>
//       <tbody>{renderTree(data)}</tbody>
//     </table>
//   );
// };

// export default TreeTable;

////////////////////////////////////////////////

// export const TreeTable: FC = () => {
//   const [isNodeExpanded, setIsNodeExpanded] = useState<boolean>(false);
//   return (
//     <div className="w-full">
//       <table className="w-full">
//         <thead>
//           <tr>
//             <td>Speciality</td>
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="flex flex-col">
//             <td onClick={() => setIsNodeExpanded(!isNodeExpanded)}>
//               {isNodeExpanded ? "[-]" : "[+]"} Dermatology
//             </td>
//             <td>
//               {isNodeExpanded && (
//                 <table className="text-center w-full">
//                   <thead>
//                     <tr className="">
//                       <td className="w-1/2">Procedure</td>
//                       <td className="w-1/2">Price</td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Acnee Treatment</td>
//                       <td>200</td>
//                     </tr>
//                     <tr>
//                       <td>Infection Treatment</td>
//                       <td>250</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               )}
//             </td>
//           </tr>
//           <tr className="flex flex-col">
//             <td onClick={() => setIsNodeExpanded(!isNodeExpanded)}>
//               {isNodeExpanded ? "[-]" : "[+]"} Neurology
//             </td>
//             <td>
//               {isNodeExpanded && (
//                 <table className="text-center w-full">
//                   <thead>
//                     <tr className="">
//                       <td className="w-1/2">Procedure</td>
//                       <td className="w-1/2">Price</td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Neurology1 Treatment</td>
//                       <td>200</td>
//                     </tr>
//                     <tr>
//                       <td>Neurology2 Treatment</td>
//                       <td>250</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               )}
//             </td>
//           </tr>
//           <tr className="flex flex-col">
//             <td onClick={() => setIsNodeExpanded(!isNodeExpanded)}>
//               {isNodeExpanded ? "[-]" : "[+]"} Internal Medicine
//             </td>
//             <td>
//               {isNodeExpanded && (
//                 <table className="text-center w-full">
//                   <thead>
//                     <tr className="">
//                       <td className="w-1/2">Procedure</td>
//                       <td className="w-1/2">Price</td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Internal Medicine1 Treatment</td>
//                       <td>200</td>
//                     </tr>
//                     <tr>
//                       <td>Infection Treatment Treatment2</td>
//                       <td>250</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               )}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

////////////////////////////////////////////////

interface TreeNode {
  specialityName: string;
  procedures: {
    procedureId: string;
    procedureName: string;
    procedurePrice: number;
  }[];
}

export const TreeTable: FC = () => {
  const initialNodes: TreeNode[] = [
    {
      specialityName: "Dermatology",
      procedures: [
        {
          procedureId: "procedure1",
          procedureName: "Acne Treatment",
          procedurePrice: 200,
        },
        {
          procedureId: "procedure2",
          procedureName: "Infection Treatment",
          procedurePrice: 250,
        },
        // {
        //   procedureId: "",
        //   procedureName: "",
        //   procedurePrice: 0,
        // },
      ],
    },
    {
      specialityName: "Neurology",
      procedures: [
        {
          procedureId: "procedure3",
          procedureName: "Neurology1 Treatment",
          procedurePrice: 200,
        },
        {
          procedureId: "procedure4",
          procedureName: "Neurology2 Treatment",
          procedurePrice: 250,
        },
      ],
    },
    {
      specialityName: "Internal Medicine",
      procedures: [
        {
          procedureId: "procedure5",
          procedureName: "Internal Medicine1 Treatment",
          procedurePrice: 200,
        },
        {
          procedureId: "procedure6",
          procedureName: "Infection Treatment Treatment2",
          procedurePrice: 250,
        },
      ],
    },
  ];

  const [nodes, setNodes] = useState<{ name: string; expanded: boolean }[]>(
    initialNodes.map((node) => ({ name: node.specialityName, expanded: false }))
  );

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

  const toggleNode = (index: number) => {
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      updatedNodes[index].expanded = !updatedNodes[index].expanded;
      return updatedNodes;
    });
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <td>Speciality</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node, index) => (
            <tr className="flex flex-col" key={index}>
              <td onClick={() => toggleNode(index)}>
                {node.expanded ? "[-]" : "[+]"} {node.name}
              </td>
              <td>
                {node.expanded && (
                  <table className="text-center w-full">
                    <thead>
                      <tr>
                        <td className="w-1/3">Procedure Id</td>
                        <td className="w-1/3">Procedure</td>
                        <td className="w-1/3">Price</td>
                        <td>Actions</td>
                        {/* <td>Actions</td> */}
                      </tr>
                    </thead>
                    <tbody>
                      {initialNodes[index].procedures.map((procedure, idx) => (
                        <tr key={idx}>
                          <td>{procedure.procedureId}</td>
                          <td>{procedure.procedureName}</td>
                          <td>{procedure.procedurePrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
