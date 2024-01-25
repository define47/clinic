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

export type MedicalSpeciality = {
  medicalSpecialityId?: string;
  medicalSpecialityName: string;
};

export type TableRow = User | MedicalSpeciality;

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
  // roleId?: string;
  // roleName?: string;
  entity: string;
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

export type DeleteMedicalSpecialityOverlayPros = {
  medicalSpeciality: MedicalSpeciality;
};

export type UpdateMedicalSpecialityOverlayProps = {
  medicalSpeciality: MedicalSpeciality;
};

export type UserSearchCriteria = {
  userSearchCriteriaName: string;
  userSearchCriteriaValue: string;
};

export type UserSearchCriterionPickerProps = {
  entity: string;
  selectedUserSearchCriteriaName: string;
  setSelectedUserSearchCriteriaName: (
    selectedUserSearchCriteriaName: string
  ) => void;
  selectedUserSearchCriteriaValue: string;
  setSelectedUserSearchCriteriaValue: (
    selectedUserSearchCriteriaValue: string
  ) => void;
};
