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
  isUserEmailActivated?: boolean;
  isUserApprovedByAdmin?: boolean;
  isUserBanned?: boolean;
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
    appointmentCancellationReason: string;
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

export type MedicalProcedure = {
  medicalProcedureId?: string;
  medicalProcedureName: string;
  medicalProcedurePrice: number;
  // medicalProcedureEstimatedTimeMinutes: number;
};

export type TableRow =
  | User
  | MedicalSpeciality
  | AppointmentTableData
  | MedicalProcedure;

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

export type BottomBarItemProps = {
  to: string;
  icon: ReactNode;
  title: string;
  isActive: boolean;
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
  shouldDataBeFetched: boolean;
  label: string;
  roleName: string;
  selectedUserId: string;
  setSelectedUserId: (selectedUserId: string) => void;
  selectedUserName: string;
  setSelectedUserName: (selectedUserName: string) => void;
  disabled?: boolean;
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

export type AppointmentStatus = {
  appointmentStatusName: string;
  appointmentStatusValue: string;
};

export type AppointmentStatusPickerProps = {
  selectedAppointmentStatusName: string;
  setSelectedAppointmentStatusName: (
    selectedAppointmentStatusName: string
  ) => void;
  selectedAppointmentStatusValue: string;
  setSelectedAppointmentStatusValue: (
    selectedAppointmentStatusValue: string
  ) => void;
  z: string;
};

export type DeleteAppointmentOverlayPros = {
  appointmentId: string;
};

export type UpdateAppointmentOverlayDoctorData = {
  doctorId: string;
  doctorForename: string;
  doctorSurname: string;
};

export type UpdateAppointmentOverlayPatientData = {
  patientId: string;
  patientForename: string;
  patientSurname: string;
  patientEmail: string;
};

export type UpdateAppointmentOverlayProps = {
  appointment: Appointment;
  doctorData: UpdateAppointmentOverlayDoctorData;
  patientData: UpdateAppointmentOverlayPatientData;
};

export type AppointmentHistoryProps = {
  appointmentId: string;
};

export type AppointmentHistory = {
  appointmentHistory: {
    appointmentHistoryId: string;
    appointmentId: string;
    appointmentHistoryDoctorId: string;
    appointmentHistoryPatientId: string;
    appointmentHistoryReason: string;
    appointmentHistoryDateTime: string;
    appointmentHistoryStatus: string;
    appointmentHistoryCancellationReason: string | null;
  };
  creator: {
    appointmentHistoryCreatedBy: string;
    appointmentHistoryCreatedByForename: string;
    appointmentHistoryCreatedBySurname: string;
    appointmentHistoryCreatedAt: string;
  };
  modifier: {
    appointmentHistoryUpdatedBy: string;
    appointmentHistoryUpdatedByForename: string;
    appointmentHistoryUpdatedBySurname: string;
    appointmentHistoryUpdatedAt: string;
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
  };
};

export type CardEntryProps = {
  cardEntryType?: string;
  cardEntryTitle: string;
  cardEntryData: string;
};

export type LimitPickerProps = {
  selectedLimit: number;
  setSelectedLimit: (selectedLimit: number) => void;
};

export type DeleteMedicalProcedureOverlayProps = {
  medicalSpecialityId: string;
  medicalProcedure: MedicalProcedure;
};

export type UpdateMedicalProcedureOverlayProps = {
  medicalProcedure: MedicalProcedure;
};

export type BookedDoctorAppointmentSlot = {
  appointmentId: string;
  appointmentDateTime: string;
};

export type MedicalRecordPatient = {
  medicalRecordPatientId: string;
  appointmentId: string;
  symptoms: string;
  conductedTests: string;
  diagnosis: string;
  recommendations: string;
};

export type CreateMedicalRecordPatientOverlayProps = {
  appointment: AppointmentTableData;
};
