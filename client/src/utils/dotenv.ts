export const serverURL = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}`;

export const authPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_PATH}`;
export const verifyUserPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_PATH}/read-signed-cookie`;
export const loginUserPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_PATH}/login`;
export const logoutUserPath = `${serverURL}${
  import.meta.env.VITE_SERVER_AUTH_PATH
}/logout`;

export const usersAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USERS_PATH}`;

export const medicalSpecialitiesAPIPath = `${
  import.meta.env.VITE_SERVER_SCHEME
}${import.meta.env.VITE_SERVER_HOST_AND_PORT}${
  import.meta.env.VITE_SERVER_MEDICAL_SPECIALITIES_PATH
}`;

export const appointmentsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_PATH
}`;

export const medicalProceduresAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_PROCEDURES_PATH
}`;

export const appointmentsDoctorAvailabilityAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_DOCTOR_AVAILABILITY
}`;

export const appointmentHistoryAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_HISTORY_PATH
}`;

export const userPreferencesAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PREFERENCES_PATH
}`;

export const notificationsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_NOTIFICATIONS_PATH
}`;

export const userProfilePictureAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PROFILE_PICTURE_PATH
}`;

export const generalDataAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_GENERAL_DATA_PATH
}`;

export const medicalRecordPatientsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_RECORD_PATIENTS_PATH
}`;

export const patientRoleId = import.meta.env.VITE_PATIENT_ROLE_ID;
export const patientRoleName = import.meta.env.VITE_PATIENT_ROLE_NAME;

export const receptionistRoleId = import.meta.env.VITE_RECEPTIONIST_ROLE_ID;
export const receptionistRoleName = import.meta.env.VITE_RECEPTIONIST_ROLE_NAME;

export const doctorRoleId = import.meta.env.VITE_DOCTOR_ROLE_ID;
export const doctorRoleName = import.meta.env.VITE_DOCTOR_ROLE_NAME;

export const nurseRoleId = import.meta.env.VITE_NURSE_ROLE_ID;
export const nurseRoleName = import.meta.env.VITE_NURSE_ROLE_NAME;
