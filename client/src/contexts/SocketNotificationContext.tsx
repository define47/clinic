import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface SocketNotificationDataInterface {
  data: any;
}

type SocketNotificationDataContextValue = {
  socketNotificationDataState: SocketNotificationDataInterface | undefined;
  socketNotificationDataSetState: Dispatch<
    SetStateAction<SocketNotificationDataInterface | undefined>
  >;
};

export const SocketNotificationDataContext = createContext<
  SocketNotificationDataContextValue | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const SocketNotificationDataContextProvider: FC<Props> = ({
  children,
}) => {
  const [socketNotificationData, setSocketNotificationData] = useState<
    SocketNotificationDataInterface | undefined
  >(undefined);

  const contextValue: SocketNotificationDataContextValue = {
    socketNotificationDataState: socketNotificationData,
    socketNotificationDataSetState: setSocketNotificationData,
  };

  return (
    <SocketNotificationDataContext.Provider value={contextValue}>
      {children}
    </SocketNotificationDataContext.Provider>
  );
};
