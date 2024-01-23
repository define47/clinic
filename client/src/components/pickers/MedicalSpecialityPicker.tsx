import { FC, useState } from "react";
import { MedicalSpeciality } from "../../types";

export const MedicalSpecialityPicker: FC = () => {
  const [medicalSpecialties, setMedicalSpecialities] = useState<
    MedicalSpeciality[]
  >([]);
  return <div></div>;
};
