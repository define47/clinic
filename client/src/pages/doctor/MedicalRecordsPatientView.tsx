import { FC, useEffect, useState } from "react";
import { Book } from "../../components/Book";

export const MedicalRecordsPatientView: FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-teal-200">
      <Book />
    </div>
  );
};
