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

export const usersPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USERS_PATH}`;
export const medicalSpecialitiesPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_MEDICAL_SPECIALITIES_PATH}`;
export const appointmentsPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_PATH
}`;
export const medicalProceduresPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_PROCEDURES_PATH
}`;
export const appointmentsDoctorAvailabilityPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_DOCTOR_AVAILABILITY
}`;
export const appointmentHistoryPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_HISTORY_PATH
}`;
export const userPreferencesPath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PREFERENCES_PATH
}`;

export const notificationsPath = `${serverURL}${
  import.meta.env.VITE_SERVER_NOTIFICATIONS_PATH
}`;

export const userProfilePicturePath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PROFILE_PICTURE_PATH
}`;

export const generalDataPath = `${serverURL}${
  import.meta.env.VITE_SERVER_GENERAL_DATA_PATH
}`;

export const medicalRecordPatientsPath = `${serverURL}${
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
