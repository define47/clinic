import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { MedicalSpeciality } from "../types";

interface AuthenticatedUserDataContextInterface {
  userId: string;
  userForename: string;
  userSurname: string;
  userEmail: string;
  roleNames: string[];
  // specialityIds?: string[];
  // specialityNames?: string[];
  medicalSpecialities?: MedicalSpeciality[];
  languageId: string;
  languageCode: string;
  isDarkModeOn: boolean;
}

type AuthenticatedAUserDataContextValue = {
  authenticatedUserDataState: AuthenticatedUserDataContextInterface;
  authenticatedUserDataSetState: Dispatch<
    SetStateAction<AuthenticatedUserDataContextInterface>
  >;
};

export const AuthenticatedUserDataContext = createContext<
  AuthenticatedAUserDataContextValue | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthenticatedUserDataContextProvider: FC<Props> = ({
  children,
}) => {
  const [authenticatedUserData, setAuthenticatedUserData] =
    useState<AuthenticatedUserDataContextInterface>({
      userId: "",
      userForename: "",
      userSurname: "",
      userEmail: "",
      roleNames: [],
      languageId: "",
      languageCode: "",
      isDarkModeOn: false,
    });

  const contextValue: AuthenticatedAUserDataContextValue = {
    authenticatedUserDataState: authenticatedUserData,
    authenticatedUserDataSetState: setAuthenticatedUserData,
  };

  return (
    <AuthenticatedUserDataContext.Provider value={contextValue}>
      {children}
    </AuthenticatedUserDataContext.Provider>
  );
};
