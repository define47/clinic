import { FC } from "react";

export const DragAndDrop: FC = () => {
  const groups = ["group1", "group2", "group3", "noDrop"];
  const initialItems = [
    { id: 1, group: "group1", value: "drag 1" },
    { id: 2, group: "group1", value: "drag 2" },
    { id: 3, group: "group1", value: "drag 3" },
  ];

  return <div></div>;
};
