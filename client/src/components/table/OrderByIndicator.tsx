import { FC, useEffect, useState } from "react";
import { RiArrowUpSLine } from "react-icons/ri";

type OrderByIndicatorProps = {
  orderByIndicator: string;
  setOrderByIndicator: (orderByIndication: string) => void;
  orderByColumn: string;
};

export const OrderByIndicator: FC<OrderByIndicatorProps> = ({
  orderByIndicator,
  setOrderByIndicator,
  orderByColumn,
}) => {
  // const [orderByIndicator, setOrderByIndicator] = useState<string>("");
  const [isOrderAscending, setIsOrderAscending] = useState<boolean>(true);
  // useEffect(() => {
  //   setOrderByIndicator(`${orderByDirection}:${orderByColumn}`);
  // }, [orderByDirection, orderByColumn]);

  // useEffect(() => {
  //   setOrderByIndicator("asc:userEmail");
  // }, []);

  useEffect(() => {
    if (orderByColumn !== orderByIndicator.split(":")[1]) {
      setIsOrderAscending(true);
    }
  }, [orderByIndicator]);

  return (
    <div
      className={`transition-transform transform ${
        isOrderAscending ? "rotate-0" : "rotate-180"
      }`}
    >
      <RiArrowUpSLine
        className="text-lg"
        onClick={() => {
          if (isOrderAscending) {
            setIsOrderAscending(false);
            setOrderByIndicator(`desc:${orderByColumn}`);
          } else if (!isOrderAscending) {
            setIsOrderAscending(true);
            setOrderByIndicator(`asc:${orderByColumn}`);
          }
        }}
      />
    </div>
  );
};
