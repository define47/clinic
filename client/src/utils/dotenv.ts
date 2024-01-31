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

export const userPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USERS_PATH}`;
export const medicalSpecialityPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_MEDICAL_SPECIALITIES_PATH}`;

export const appointmentsPath = `${serverURL}${
  import.meta.env.VITE_SERVER_APPOINTMENTS_PATH
}`;

export const patientRoleId = import.meta.env.VITE_PATIENT_ROLE_ID;
export const patientRoleName = import.meta.env.VITE_PATIENT_ROLE_NAME;

export const receptionistRoleId = import.meta.env.VITE_RECEPTIONIST_ROLE_ID;
export const receptionistRoleName = import.meta.env.VITE_RECEPTIONIST_ROLE_NAME;

export const doctorRoleId = import.meta.env.VITE_DOCTOR_ROLE_ID;
export const doctorRoleName = import.meta.env.VITE_DOCTOR_ROLE_NAME;
