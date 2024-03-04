export const serverURL = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}`;

export const authAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_API_PATH}`;

export const verifyUserAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_API_PATH}/read-signed-cookie`;

export const loginUserAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_AUTH_API_PATH}/login`;

export const logoutUserAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_AUTH_API_PATH
}/logout`;

export const userAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USER_API_PATH}`;
export const usersAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USERS_API_PATH}`;

export const medicalSpecialityAPIPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_MEDICAL_SPECIALITY_API_PATH}`;
export const medicalSpecialitiesAPIPath = `${
  import.meta.env.VITE_SERVER_SCHEME
}${import.meta.env.VITE_SERVER_HOST_AND_PORT}${
  import.meta.env.VITE_SERVER_MEDICAL_SPECIALITIES_API_PATH
}`;

export const appointmentAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENT_API_PATH
}`;
export const appointmentsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_API_PATH
}`;

export const medicalProcedureAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_PROCEDURE_API_PATH
}`;
export const medicalProceduresAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_PROCEDURES_API_PATH
}`;

export const appointmentsDoctorAvailabilityAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_DOCTOR_AVAILABILITY
}`;

export const appointmentHistoryAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_HISTORY_API_PATH
}`;

export const userPreferencesAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PREFERENCES_API_PATH
}`;

export const notificationsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_NOTIFICATIONS_API_PATH
}`;

export const userProfilePictureAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_USER_PROFILE_PICTURE_API_PATH
}`;

export const generalDataAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_GENERAL_DATA_API_PATH
}`;

export const medicalRecordPatientAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_RECORD_PATIENT_API_PATH
}`;
export const medicalRecordsPatientsAPIPath = `${serverURL}${
  import.meta.env.VITE_SERVER_MEDICAL_RECORDS_PATIENTS_API_PATH
}`;

export const patientRoleId = import.meta.env.VITE_PATIENT_ROLE_ID;
export const patientRoleName = import.meta.env.VITE_PATIENT_ROLE_NAME;

export const receptionistRoleId = import.meta.env.VITE_RECEPTIONIST_ROLE_ID;
export const receptionistRoleName = import.meta.env.VITE_RECEPTIONIST_ROLE_NAME;

export const doctorRoleId = import.meta.env.VITE_DOCTOR_ROLE_ID;
export const doctorRoleName = import.meta.env.VITE_DOCTOR_ROLE_NAME;

export const nurseRoleId = import.meta.env.VITE_NURSE_ROLE_ID;
export const nurseRoleName = import.meta.env.VITE_NURSE_ROLE_NAME;
