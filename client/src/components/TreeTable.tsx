import React, { useState } from "react";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeTableProps {
  data: TreeNode[];
}

const TreeTable: React.FC<TreeTableProps> = ({ data }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (nodeName: string) => {
    setExpandedNodes((prevExpanded) =>
      prevExpanded.includes(nodeName)
        ? prevExpanded.filter((node) => node !== nodeName)
        : [...prevExpanded, nodeName]
    );
  };

  const renderTree = (nodes: TreeNode[] | undefined) => {
    if (!nodes) return null;

    return nodes.map((node) => (
      <React.Fragment key={node.name}>
        <tr>
          <td>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => toggleNode(node.name)}
            >
              {expandedNodes.includes(node.name) ? "[-]" : "[+]"}
            </span>
            {node.name}
          </td>
        </tr>
        {expandedNodes.includes(node.name) && (
          <tr>
            <td style={{ paddingLeft: "20px" }}>{renderTree(node.children)}</td>
          </tr>
        )}
      </React.Fragment>
    ));
  };

  return (
    <table>
      <tbody>{renderTree(data)}</tbody>
    </table>
  );
};

export default TreeTable;
