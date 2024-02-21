export function determineSpecialityOrder(
  medicalSpecialities: string[],
  target: string
) {
  for (let i = 0; i < medicalSpecialities.length; i++) {
    if (medicalSpecialities[i].includes(target)) return medicalSpecialities[i];
  }
}

export function capitalizeString(string: string) {
  if (string)
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function capitalizeEachWord(inputString: string) {
  const words = inputString.split(" ");

  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const resultString = capitalizedWords.join(" ");

  return resultString;
}
