type EntityActionSuccess = {
  success: string;
  error: string;
};

type UserActionSuccess = {
  success: string;
  error: string;
  errorEmail?: string;
  errorPhoneNumber?: string;
  errorDoctorWithAppointments?: string;
};

type MedicalSpecialitySuccess = {
  success: string;
  error: string;
  errorMedicalSpecialityName?: string;
  errorInUseMedicalSpecialityByDoctor?: string;
};

type MedicalProcedureSuccess = {
  success: string;
  error: string;
  errorMedicalProcedureName?: string;
};

export type ServerLanguageCollection = {
  patient: {
    create: UserActionSuccess;
    update: UserActionSuccess;
    delete: UserActionSuccess;
  };
  doctor: {
    create: UserActionSuccess;
    update: UserActionSuccess;
    delete: UserActionSuccess;
  };
  nurse: {
    create: UserActionSuccess;
    update: UserActionSuccess;
    delete: UserActionSuccess;
  };
  receptionist: {
    create: UserActionSuccess;
    update: UserActionSuccess;
    delete: UserActionSuccess;
  };
  appointment: {
    create: EntityActionSuccess;
    update: EntityActionSuccess;
    delete: EntityActionSuccess;
  };
  medicalSpeciality: {
    create: MedicalSpecialitySuccess;
    update: MedicalSpecialitySuccess;
    delete: MedicalSpecialitySuccess;
  };
  medicalProcedure: {
    create: MedicalProcedureSuccess;
    update: MedicalProcedureSuccess;
    delete: MedicalProcedureSuccess;
  };
};

type ServerLanguage = {
  [languageCode: string]: ServerLanguageCollection;
};

const serverLanguages: ServerLanguage = {
  en: {
    patient: {
      create: {
        success: "The patient has been created successfully",
        error: "The patient has NOT been created successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      update: {
        success: "The patient has been updated successfully",
        error: "The patient has NOT been updated successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      delete: {
        success: "The patient has been deleted successfully",
        error: "The patient has NOT been deleted successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
    },
    doctor: {
      create: {
        success: "The doctor has been created successfully",
        error: "The doctor has NOT been created successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      update: {
        success: "The doctor has been updated successfully",
        error: "The doctor has NOT been updated successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      delete: {
        success: "The doctor has been deleted successfully",
        error: "The doctor has NOT been deleted successfully",
        errorDoctorWithAppointments: "The doctor has appointments",
      },
    },
    nurse: {
      create: {
        success: "The nurse has been created successfully",
        error: "The nurse has NOT been created successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      update: {
        success: "The nurse has been updated successfully",
        error: "The nurse has NOT been updated successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      delete: {
        success: "The nurse has been deleted successfully",
        error: "The nurse has NOT been deleted successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
    },
    receptionist: {
      create: {
        success: "The receptionist has been created successfully",
        error: "The receptionist has NOT been created successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      update: {
        success: "The receptionist has been updated successfully",
        error: "The receptionist has NOT been updated successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
      delete: {
        success: "The receptionist has been deleted successfully",
        error: "The receptionist has NOT been deleted successfully",
        errorEmail: "There is already a patient with the provided email",
        errorPhoneNumber:
          "There is already a patient with the provided phoneNumber",
      },
    },
    appointment: {
      create: {
        success: "The appointment has been created successfully",
        error: "The appointment has NOT been created successfully",
      },
      update: {
        success: "The appointment has been updated successfully",
        error: "The appointment has NOT been updated successfully",
      },
      delete: {
        success: "The appointment has been deleted successfully",
        error: "The appointment has NOT been deleted successfully",
      },
    },
    medicalSpeciality: {
      create: {
        success: "The medical speciality has been created successfully",
        error: "The medical speciality has NOT been created successfully",
      },
      update: {
        success: "The medical speciality has been updated successfully",
        error: "The medical speciality has NOT been updated successfully",
      },
      delete: {
        success: "The medical speciality has been deleted successfully",
        error: "The medical speciality has NOT been deleted successfully",
      },
    },
    medicalProcedure: {
      create: {
        success: "The medical procedure has been created successfully",
        error: "The medical procedure has NOT been created successfully",
      },
      update: {
        success: "The medical procedure has been updated successfully",
        error: "The medical procedure has NOT been updated successfully",
      },
      delete: {
        success: "The medical procedure has been deleted successfully",
        error: "The medical procedure has NOT been deleted successfully",
      },
    },
  },
  ro: {
    patient: {
      create: {
        success: "Pacientul a fost creat cu success",
        error: "Pacientul NU a fost creat cu success",
        errorEmail: "Deja exista un user cu acea adresa de email",
        errorPhoneNumber: "Deja exista un user cu acel numar de telefon",
      },
      update: {
        success: "Pacientul a fost modificat cu success",
        error: "Pacientul NU a fost modificat cu success",
        errorEmail: "Deja exista un pacient cu acea adresa de email",
        errorPhoneNumber: "Deja exista un pacient cu acel numar de telefon",
      },
      delete: {
        success: "Pacientul a fost sters cu success",
        error: "Pacientul NU a fost sters cu success",
      },
    },
    doctor: {
      create: {
        success: "Doctorul a fost creat cu success",
        error: "Doctorul NU a fost creat cu success",
        errorEmail: "Deja exista un user cu acea adresa de email",
        errorPhoneNumber: "Deja exista un user cu acel numar de telefon",
      },
      update: {
        success: "Doctorul a fost modificat cu success",
        error: "Doctorul NU fost modificat cu success",
        errorEmail: "Deja exista un doctor cu acea adresa de email",
        errorPhoneNumber: "Deja exista un doctor cu acel numar de telefon",
      },
      delete: {
        success: "Doctorul a fost sters cu success",
        error: "Doctorul NU a fost sters cu success",
        errorDoctorWithAppointments:
          "Doctorul nu a fost sters fiindca are sau a avut programari",
      },
    },
    nurse: {
      create: {
        success: "Asistentul a fost creat cu success",
        error: "Asistentul NU a fost creat cu success",
        errorEmail: "Deja exista un user cu acea adresa de email",
        errorPhoneNumber: "Deja exista un user cu acel numar de telefon",
      },
      update: {
        success: "Asistentul a fost modificat cu success",
        error: "Asistentul NU a fost modificat cu success",
        errorEmail: "Deja exista un asistent cu acea adresa de email",
        errorPhoneNumber: "Deja exista un asistent cu acel numar de telefon",
      },
      delete: {
        success: "Asistentul a fost sters cu success",
        error: "Asistentul NU a fost sters cu success",
      },
    },
    receptionist: {
      create: {
        success: "Receptionistul a fost creat cu success",
        error: "Receptionistul NU a fost creat cu success",
        errorEmail: "Deja exista un user cu acea adresa de email",
        errorPhoneNumber: "Deja exista un user cu acel numar de telefon",
      },
      update: {
        success: "Receptionistul a fost modificat cu success",
        error: "Receptionistul NU a fost modificat cu success",
        errorEmail: "Deja exista un receptionist cu acea adresa de email",
        errorPhoneNumber:
          "Deja exista un receptionist cu acel numar de telefon",
      },
      delete: {
        success: "Receptionistul a fost sters cu success",
        error: "Receptionistul NU a fost sters cu success",
      },
    },
    appointment: {
      create: {
        success: "Programarea a fost creat cu success",
        error: "Programarea NU a fost creata cu success",
      },
      update: {
        success: "Programarea a fost modificata cu success",
        error: "Programarea NU a fost modificata cu success",
      },
      delete: {
        success: "Programarea a fost stearsa cu success",
        error: "Programarea NU a fost stearsa cu success",
      },
    },
    medicalSpeciality: {
      create: {
        success: "Specialitatea Medicala a fost creata cu success",
        error: "Specialitatea Medicala NU a fost creata cu success",
        errorMedicalSpecialityName:
          "Specialitatea Medicala NU a fost creata cu success fiindca deja exista o specialitate medicala cu acel nume",
      },
      update: {
        success: "Specialitatea Medicala a fost modificata cu success",
        error: "Specialitatea Medicala NU a fost modificata cu success",
        errorMedicalSpecialityName:
          "Specialitatea Medicala NU a fost modificata cu success fiindca deja exista o specialitate medicala cu acel nume",
      },
      delete: {
        success: "Specialitatea Medicala a fost stearsa cu success",
        error: "Specialitatea Medicala NU a fost stearsa cu success",
        errorInUseMedicalSpecialityByDoctor:
          "Specialitatea Medicala NU a fost stearsa cu success fiindca unul sau mai multi doctori se bazeaza pe acea specialitate",
      },
    },
    medicalProcedure: {
      create: {
        success: "Procedura Medicala a fost creata cu success",
        error: "Procedura Medicala NU a fost creata cu success",
        errorMedicalProcedureName:
          "Procedura Medicala NU a fost creata cu success fiindca deja exista o procedura medicala cu acel nume",
      },
      update: {
        success: "Procedura Medicala a fost modificata cu success",
        error: "Procedura Medicala NU a fost modificata cu success",
        errorMedicalProcedureName:
          "Procedura Medicala NU a fost modificata cu success fiindca deja exista o procedura medicala cu acel nume",
      },
      delete: {
        success: "Procedura Medicala a fost stearsa cu success",
        error: "Procedura Medicala NU a fost stearsa cu success",
      },
    },
  },
};

export function getEntityMessage(
  languageCode: string,
  entity: keyof ServerLanguageCollection,
  entityAction: string,
  entitySuccess:
    | keyof EntityActionSuccess
    | keyof UserActionSuccess
    | keyof MedicalSpecialitySuccess
    | keyof MedicalProcedureSuccess
) {
  const selectedLanguageCollection = serverLanguages[languageCode];

  const selectedEntity = selectedLanguageCollection[entity];

  let selectedEntityAction;

  if (entityAction === "create") {
    selectedEntityAction = selectedEntity.create;
  } else if (entityAction === "update") {
    selectedEntityAction = selectedEntity.update;
  } else if (entityAction === "delete") {
    selectedEntityAction = selectedEntity.delete;
  }

  if (selectedEntityAction) {
    const serverMessage = (selectedEntityAction as any)[entitySuccess];

    console.log(serverMessage);

    return serverMessage;
  }
}
