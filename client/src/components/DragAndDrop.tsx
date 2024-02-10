import { FC, useEffect, useState } from "react";

export const DragAndDrop: FC = () => {
  const groups = ["group1", "group2", "group3", "noDrop"];
  const initialItems = [
    { id: 1, group: "group1", value: "drag 1" },
    { id: 2, group: "group1", value: "drag 2" },
    { id: 3, group: "group1", value: "drag 3" },
  ];

  const [items, setItems] = useState(initialItems);
  const [dragData, setDragData] = useState({});
  const [noDrop, setNoDrop] = useState("");

  const handleDragStart = (e, id, group) => {
    setDragData({ id: id, initialGroup: group });
  };

  const handleDragEnter = (e, group) => {
    if (group === "noDrop") {
      setNoDrop("noDrop");
    }
  };

  // setNoDrop to nothing to return styling to normal
  const handleDragLeave = (e) => {
    setNoDrop("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const changeCategory = (itemId, group) => {
    const newItems = [...items];
    newItems[itemId - 1].group = group;
    setItems([...newItems]);
  };

  const handleDrop = (e, group) => {
    setNoDrop("");
    const selected = dragData.id;
    if (group === "noDrop") {
      console.log("nuh uh");
    } else {
      changeCategory(selected, group);
    }
  };

  useEffect(() => {
    console.log("dragData", dragData);
  }, [dragData]);

  useEffect(() => {
    console.log("noDrop", noDrop);
  }, [noDrop]);

  return (
    <>
      <div className="groups">
        {groups.map((group) => (
          <div
            className="group"
            onDragEnter={(e) => handleDragEnter(e, group)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, group)}
          >
            <h1 className="title">{group}</h1>
            <div>
              {items
                .filter((item) => item.group === group)
                .map((item) => (
                  <div
                    key={item.id}
                    id={item.id.toString()}
                    className="item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, group)}
                  >
                    {item.value}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
