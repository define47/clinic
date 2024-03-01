type EntityActionSuccess = {
  success: string;
  error: string;
};

type ServerLanguageCollection = {
  patient: {
    create: EntityActionSuccess;
    update: EntityActionSuccess;
    delete: EntityActionSuccess;
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
      },
      update: {
        success: "The patient has been updated successfully",
        error: "The patient has NOT been updated successfully",
      },
      delete: {
        success: "The patient has been deleted successfully",
        error: "The patient has NOT been deleted successfully",
      },
    },
  },
};

export function getEntityMessage(
  languageCode: string,
  entity: keyof ServerLanguageCollection,
  entityAction: string,
  entitySuccess: keyof EntityActionSuccess
) {
  const selectedLanguageCollection = serverLanguages[languageCode];
  const selectedEntity = selectedLanguageCollection[entity];
  let selectedEntityAction;

  if (entityAction === "create") {
    selectedEntityAction = selectedEntity.create;
  } else if (entityAction === "update") {
    selectedEntityAction = selectedEntity.update;
  } else if (entityAction === "delete") {
    selectedEntityAction = selectedEntity.create;
  }

  if (selectedEntityAction) {
    const serverMessage = selectedEntityAction[entitySuccess];
    console.log(serverMessage);

    return serverMessage;
  }

  //   console.log(selectedEntityAction);
}
