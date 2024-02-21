type ClientLanguageCollection = {
  sidebarMenuAdmin: string[];
  appointmentTableColumnNames: string[];
  generalUserTableColumnNames: string[];
  medicalSpecialityTableColumnNames: string[];
  medicalProcedureTableColumnNames: string[];
  entityNames: string[];
  periodNames: string[];
  searchCriterion: string[];
  searchFieldNames: string[];
  actions: string[];
  searchCriterionUser: string[];
  searchCriterionAppointment: string[];
  medicalSpecialityPickerLabels: string[];
  pageNavigationButtonNames: string[];
  appointmentStatuses: string[];
};
type ClientLanguage = {
  [languageCode: string]: ClientLanguageCollection;
};

export const clientLanguages: ClientLanguage = {
  ro: {
    sidebarMenuAdmin: [
      "Panou Principal",
      "Programări",
      "Pacienți",
      "Doctori",
      "Specialități Medicale",
      "Proceduri Medicale",
      "Asistenți",
      "Recepționiști",
      "Setări",
      "Ghid",
      "Acțiuni",
    ],
    appointmentTableColumnNames: [
      "Nume Doctor",
      "Nume Pacient",
      "Motiv Programare",
      "Data și Ora Programării",
      "Status Programare",
      "Motiv Anulare",
      "Acțiuni",
    ],
    generalUserTableColumnNames: [
      "Prenume",
      "Nume Familie",
      "Adresă Email",
      "Număr Telefon",
      "Gen",
      "Ziua De Naștere",
      "Domiciliu",
      "Specialitate Primară",
      "Specialitate Secundară",
      "Specialitate Terțiară",
      "Acțiuni",
    ],
    medicalSpecialityTableColumnNames: [
      "Denumire Specialitate Medicală",
      "Acțiuni",
    ],
    medicalProcedureTableColumnNames: [
      "Denumire Procedură Medicală",
      "Preț Procedură Medicală",
      "Acțiuni",
    ],
    entityNames: [
      "Admin",
      "Doctor",
      "Pacient",
      "Recepționist",
      "Specialitate Medicală",
      "Procedură Medicală",
      "Asistent",
    ],
    periodNames: [
      "Azi",
      "Săptămâna Curentă",
      "Săptămâna Viitoare",
      "Luna Curentă",
      "Perioadă Personalizată",
    ],
    searchCriterion: [
      "Criteriu Căutare Programări",
      "Criteriu Căutare Pacienți",
      "Criteriu Căutare Doctori",
      "Criteriu Căutare Asistenti",
      "Criteriu Căutare Receptionisti",
    ],
    searchFieldNames: [
      "Cauta Programare",
      "Cauta Pacient",
      "Cauta Doctor",
      "Cauta Specialitate Medicala",
      "Cauta Procedura Medicala",
      "Cauta Asistent",
      "Cauta Receptionist",
    ],

    actions: ["Creează", "Modifică", "Șterge"],
    searchCriterionUser: [
      "Prenume",
      "Nume Familie",
      "Adresa Email",
      "Numar Telefor",
    ],
    searchCriterionAppointment: [
      "Prenume Doctor",
      "Nume Familie Doctor",
      "Prenume si Nume Familie Doctor",
      "Prenume Pacient",
      "Nume Familie Pacient",
      "Prenume si Nume Familie Pacient",
    ],
    medicalSpecialityPickerLabels: [
      "Selectează Specialitate Medicală",
      "Selectează Specialitate Medicală Primară",
      "Selectează Specialitate Medicală Secundară",
      "Selectează Specialitate Medicală Terțiară",
    ],
    pageNavigationButtonNames: ["Pagina Anterioară", "Pagina Următoare"],
    appointmentStatuses: [
      "Programat",
      "Reprogramat",
      "Complet",
      "Neprezentat",
      "Aprobare In Asteptare",
      "Asteptand",
      "Confirmat De Catre Pacient",
      "Anulat De Catre Pacient",
      "Achitat",
    ],
  },

  "en-GB": {
    sidebarMenuAdmin: [
      "Dashboard",
      "Appointments",
      "Patients",
      "Doctors",
      "Medical Specialities",
      "Medical Procedures",
      "Nurses",
      "Receptionist",
      "Settings",
      "Guide",
    ],
    appointmentTableColumnNames: [
      "Doctor",
      "Patient",
      "Reason",
      "Date Time",
      "Status",
      "Cancellation Reason",
    ],
    generalUserTableColumnNames: [
      "Forename",
      "Surname",
      "Email",
      "Phone Number",
      "Gender",
      "Date Of Birth",
      "Address",
      "Primary Speciality",
      "Secondary Speciality",
      "Tertiary Speciality",
      "Actions",
    ],
    medicalSpecialityTableColumnNames: ["Medical Speciality Name", "Actions"],
    medicalProcedureTableColumnNames: [
      "Medical Procedure Name",
      "Medical Procedure Price",
      "Actions",
    ],
    entityNames: [
      "Admin",
      "Doctor",
      "Patient",
      "Receptionist",
      "Medical Speciality",
      "Medical Procedure",
      "Nurse",
    ],
    periodNames: [
      "Today",
      "Current Week",
      "Next Week",
      "Current Month",
      "Custom",
    ],
    searchCriterion: [
      "Search Criteria Appointments",
      "Search Criteria Patients",
      "Search Criteria Doctors",
      "Search Criteria Nurses",
      "Search Criteria Receptionists",
    ],
    searchFieldNames: [
      "Search Appointment",
      "Search Patient",
      "Search Doctor",
      "Search Medical Speciality",
      "Search Medical Procedure",
      "Search Nurse",
      "Search Receptionist",
    ],
    actions: ["Create", "Update", "Delete"],
    searchCriterionUser: [
      "Forename",
      "Surname",
      "Email Address",
      "Phone Number",
    ],
    searchCriterionAppointment: [
      "Doctor Forename",
      "Doctor Surname",
      "Doctor Forename and Surname",
      "Patient Forename",
      "Patient Surname",
      "Patient Forename and Surname",
    ],
    medicalSpecialityPickerLabels: [
      "Select Medical Speciality",
      "Select Primary Medical Speciality",
      "Select Secondary Medical Speciality",
      "Select Tertiary Medical Speciality",
    ],
    pageNavigationButtonNames: ["Previous Page", "Next Page"],
    appointmentStatuses: [
      "Scheduled",
      "Rescheduled",
      "Completed",
      "No-Show",
      "Pending Approval",
      "Waiting",
      "Confirmed By Patient",
      "Canceled By Patient",
      "Paid",
    ],
  },
};

export function getItemInUserSelectedLanguageCode(
  userSelectedLanguageCode: string,
  collectionKey: keyof ClientLanguageCollection,
  itemName: string
) {
  const userSelectedLanguageCodeCollections =
    clientLanguages[userSelectedLanguageCode];

  if (collectionKey === "appointmentStatuses") {
    const foundAppointmentIndex = [
      "Scheduled",
      "Rescheduled",
      "Completed",
      "No-Show",
      "Pending Approval",
      "Waiting",
      "Confirmed By Patient",
      "Canceled By Patient",
      "Paid",
    ].indexOf(itemName);

    if (foundAppointmentIndex !== -1)
      return userSelectedLanguageCodeCollections.appointmentStatuses[
        foundAppointmentIndex
      ];
  }
}

export function getItemByLanguageAndCollection(
  selectedLanguageCode: string,
  collectionKey: keyof ClientLanguageCollection,
  itemIndex: number
) {
  const languageCollection = clientLanguages[selectedLanguageCode];
  const items =
    languageCollection[collectionKey as keyof ClientLanguageCollection];
  const item = items[itemIndex];
  console.log(item);
  return item;
}

export function getEntityNamesByLanguage(
  selectedLanguageCode: string,
  entityName: string
) {
  const entityNamesByLanguage =
    clientLanguages[selectedLanguageCode].entityNames;

  if (entityNamesByLanguage) {
    const entityNameIndex = [
      "admin",
      "doctor",
      "patient",
      "receptionist",
      "medical Speciality",
      "medical Procedure",
      "nurse",
    ].indexOf(entityName);
    if (entityNameIndex !== -1) return entityNamesByLanguage[entityNameIndex];
  }
}

export function getAppointmentTableColumnNamesByLanguage(
  selectedLanguageCode: string,
  appointmentTableColumnName: string
) {
  const appointmentTableColumnNamesByLanguage =
    clientLanguages[selectedLanguageCode];

  if (
    appointmentTableColumnNamesByLanguage &&
    appointmentTableColumnNamesByLanguage.appointmentTableColumnNames
  ) {
    const appointmentTableColumnNameIndex = [
      "Doctor",
      "Patient",
      "Reason",
      "Date Time",
      "Status",
      "Cancellation Reason",
    ].indexOf(appointmentTableColumnName);
    if (appointmentTableColumnNameIndex !== -1)
      return appointmentTableColumnNamesByLanguage.appointmentTableColumnNames[
        appointmentTableColumnNameIndex
      ];
  }
}

export function getGeneralUserTableColumnNamesByLanguage(
  selectedLanguageCode: string,
  generalUserTableColumnName: string
) {
  const generalUserTableColumnNamesByLanguage =
    clientLanguages[selectedLanguageCode];

  if (
    generalUserTableColumnNamesByLanguage &&
    generalUserTableColumnNamesByLanguage.generalUserTableColumnNames
  ) {
    const generalUserTableColumnNameIndex = [
      "Forename",
      "Surname",
      "Email",
      "Phone Number",
      "Gender",
      "Date Of Birth",
      "Address",
      "Primary Speciality",
      "Secondary Speciality",
      "Tertiary Speciality",
      "Actions",
    ].indexOf(generalUserTableColumnName);

    if (generalUserTableColumnNameIndex !== -1)
      return generalUserTableColumnNamesByLanguage.generalUserTableColumnNames[
        generalUserTableColumnNameIndex
      ];
  }
}

// ă ș ț
