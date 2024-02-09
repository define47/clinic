import { useEffect, useState } from "react";

export function VirtualizedList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight),
    items.length
  );
  const visibleItems = items.slice(startIndex, endIndex);
  const invisibleItemsHeight =
    (startIndex + visibleItems.length - endIndex) * itemHeight;
  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };

  useEffect(() => {
    console.log("Visible Items:", visibleItems);
  }, [visibleItems]);
  return (
    <div
      style={{ height: `${containerHeight}px`, overflowY: "scroll" }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${items.length * itemHeight}px` }}>
        <div
          style={{
            position: "relative",
            height: `${visibleItems.length * itemHeight}px`,
            top: `${startIndex * itemHeight}px`,
          }}
        >
          {visibleItems.map((item) => (
            <div key={item.id} style={{ height: `${itemHeight}px` }}>
              {item.content}
            </div>
          ))}
        </div>
        <div style={{ height: `${invisibleItemsHeight}px` }} />
      </div>
    </div>
  );
}
