import { ReactNode } from "react";

export type User = {
  userId: string;
  userForename: string;
  userSurname: string;
  userEmail: string;
  userPhoneNumber: string;
  userGender: string;
  userDateOfBirth: string;
  userAddress: string;
  userEncryptedPassword?: string;
  medicalSpecialities?: string[];
  isUserEmailActivated: boolean;
  isUserApprovedByAdmin: boolean;
  isUserBanned: boolean;
  userRoleId: string;
  userRoleName: string;
};

export type TableRow = User;

export type UserToLogin = {
  userEmail: string;
  userPassword: string;
};

export type SidebarProps = {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (isSidebarExpanded: boolean) => void;
};

export type SidebarItemProps = {
  to: string;
  icon: ReactNode;
  title: string;
  active: boolean;
  isSidebarExpanded: boolean;
};

export type TopBarProps = {
  isSidebarExtended: boolean;
  setIsSidebarExtended: (isSidebarExtended: boolean) => void;
};

export type GeneralTableProps = {
  URL: string;
  roleId: string;
  roleName: string;
};

export type CreateUserOverlayPros = {
  roleId: string;
  roleName: string;
};

export type UpdateUserOverlayPros = {
  user: User;
  roleName: string;
};

export type DeleteUserOverlayPros = {
  user: User;
  roleName: string;
};
