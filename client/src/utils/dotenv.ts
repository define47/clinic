export const usersPath = `${import.meta.env.VITE_SERVER_SCHEME}${
  import.meta.env.VITE_SERVER_HOST_AND_PORT
}${import.meta.env.VITE_SERVER_USERS_PATH}`;

export const patientRoleId = import.meta.env.VITE_PATIENT_ROLE_ID;
export const patientRoleName = import.meta.env.VITE_PATIENT_ROLE_NAME;

export const receptionistRoleId = import.meta.env.VITE_RECEPTIONIST_ROLE_ID;
export const receptionistRoleName = import.meta.env.VITE_RECEPTIONIST_ROLE_NAME;

export const doctorRoleId = import.meta.env.VITE_DOCTOR_ROLE_ID;
export const doctorRoleName = import.meta.env.VITE_DOCTOR_ROLE_NAME;
