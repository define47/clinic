import React, { useState, useEffect } from "react";

export function VirtualizedTable({
  data,
  columns,
  rowHeight,
  containerHeight,
  columnWidth,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / rowHeight),
    data.length
  );
  const visibleRows = data.slice(startIndex, endIndex);
  const invisibleRowsHeight =
    (startIndex + visibleRows.length - endIndex) * rowHeight;

  useEffect(() => {
    console.log("Visible Rows:", visibleRows);
  }, [visibleRows]);

  const handleScroll = (event) => {
    setScrollTop(event.target.scrollTop);
  };

  return (
    <div
      style={{ height: `${containerHeight}px`, overflowY: "scroll" }}
      onScroll={handleScroll}
    >
      <div
        style={{
          width: "100%",
          height: `${data.length * rowHeight}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${startIndex * rowHeight}px`,
            width: "100%",
            height: `${visibleRows.length * rowHeight}px`,
          }}
        >
          {visibleRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{ display: "flex", height: `${rowHeight}px` }}
            >
              {columns.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  style={{ flex: `0 0 ${columnWidth}px`, overflow: "hidden" }}
                >
                  {row[column.dataKey]}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height: `${invisibleRowsHeight}px` }} />
      </div>
    </div>
  );
}
