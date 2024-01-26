export function determineSpecialityOrder(
  medicalSpecialities: string[],
  target: string
) {
  for (let i = 0; i < medicalSpecialities.length; i++) {
    if (medicalSpecialities[i].includes(target)) return medicalSpecialities[i];
  }
}
