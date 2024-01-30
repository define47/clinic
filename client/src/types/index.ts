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

export type AppointmentTableData = {
  appointment: {
    appointmentId: string;
    appointmentDoctorId: string;
    appointmentPatientId: string;
    appointmentReason: string;
    appointmentDateTime: string;
    appointmentStatus: string;
    appointmentCancellationReason: string | null;
  };
  doctor: {
    doctorId: string;
    doctorForename: string;
    doctorSurname: string;
  };
  patient: {
    patientId: string;
    patientForename: string;
    patientSurname: string;
    patientEmail: string;
  };
};

export type TableRow = User | MedicalSpeciality | AppointmentTableData;

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

export type AppointmentSearchCriteria = {
  table: string;
  appointmentSearchCriteriaName: string;
  appointmentSearchCriteriaValue: string;
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

export type MedicalSpecialityPickerProps = {
  label: string;
  selectedMedicalSpecialityName: string;
  setSelectedMedicalSpecialityName: (
    selectedMedicalSpecialityName: string
  ) => void;
  selectedMedicalSpecialityId: string;
  setSelectedMedicalSpecialityId: (selectedMedicalSpecialityId: string) => void;
  selectedPrimaryMedicalSpecialityId?: string;
  selectedSecondaryMedicalSpecialityId?: string;
  selectedTertiaryMedicalSpecialityId?: string;
};

export type AppointmentSearchCriterionPickerProps = {
  selectedTable: string;
  setSelectedTable: (selectedTable: string) => void;
  selectedAppointmentCriteriaValue: string;
  setSelectedAppointmentCriteriaValue: (
    selectedAppointmentCriteriaValue: string
  ) => void;
  selectedAppointmentCriteriaName: string;
  setSelectedAppointmentCriteriaName: (
    selectedAppointmentCriteriaName: string
  ) => void;
};

export type AppointmentPeriodPickerProps = {
  selectedAppointmentPeriodValue: string;
  setSelectedAppointmentPeriodValue: (
    selectedAppointmentPeriodValue: string
  ) => void;
};

export type UserPickerProps = {
  label: string;
  roleName: string;
  z: string;
};

export type Appointment = {
  appointmentId?: string;
  appointmentDoctorId: string;
  appointmentPatientId: string;
  appointmentReason: string;
  appointmentDateTime: string;
  appointmentStatus: string;
  appointmentCancellationReason?: string;
};
