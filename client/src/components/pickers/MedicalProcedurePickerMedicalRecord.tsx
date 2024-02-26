import { FC, useContext, useEffect, useState } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import axios from "axios";
import { medicalProceduresAPI } from "../../utils/dotenv";
import { MedicalSpeciality } from "../../types";

export const MedicalProcedurePickerMedicalRecord: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [medicalSpecialities, setMedicalSpecialities] = useState<
    MedicalSpeciality[]
  >([]);
  const [medicalProcedures, setMedicalProcedures] = useState<any>([]);
  const [dragData, setDragData] = useState<any>({
    medicalSpecialityId: "",
    originalMedicalSpecialityId: "",
    updatedMedicalSpecialityId: "",
    currentGroupId: "",
    medicalProcedureId: "",
    medicalProcedureName: "",
    medicalProcedurePrice: -1,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    async function getDoctorProcedures() {
      const medicalSpecialityIds =
        authenticatedUserDataState.medicalSpecialities?.map(
          ({ medicalSpecialityId }) => medicalSpecialityId
        );

      console.log("medicalSpecialityIds", medicalSpecialityIds);

      try {
        const response = await axios.get(medicalProceduresAPI, {
          params: {
            message: "medicalProceduresByMedicalSpecialities",
            medicalSpecialityIds: medicalSpecialityIds?.join(","),
          },
          withCredentials: true,
        });

        if (response.data.success) {
          const data = response.data.payload.map((medicalProcedure) => ({
            updatedMedicalSpecialityId: "",
            originalMedicalSpecialityId: medicalProcedure.medicalSpecialityId,
            currentGroupId: medicalProcedure.medicalSpecialityId,
            ...medicalProcedure,
          }));
          setMedicalProcedures(data);
        }

        console.log("medicalSpecialityIds", response);
      } catch (error) {
        console.log(error);
      }
    }

    getDoctorProcedures();
    setMedicalSpecialities(authenticatedUserDataState.medicalSpecialities!);

    setMedicalSpecialities((current) => [
      ...current,
      {
        medicalSpecialityName: "Conducted Tests",
        medicalSpecialityId: "123456",
      },
    ]);
  }, []);

  useEffect(() => {
    console.log("here medicalSpecialityGroups", medicalSpecialities);
    console.log("here medicalProcedures", medicalProcedures);
  }, [medicalSpecialities, medicalProcedures]);

  useEffect(() => {
    console.log("here drag", dragData);
  }, [dragData]);

  const handleDragEnter = (e, group: Group) => {};

  const handleDragLeave = (e) => {};

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function handleDragStart(
    e,
    medicalProcedure,
    medicalSpeciality: MedicalSpeciality
  ) {
    setDragData({
      ...medicalProcedure,
    });
  }

  function handleGroupChange(
    medicalProcedureId: string,
    medicalSpecialityId: string,
    updatedMedicalSpecialityId: string
  ) {
    if (updatedMedicalSpecialityId === "123456") {
      setMedicalProcedures((prevMedicalProcedures: any) => {
        const updatedMedicalProcedures = prevMedicalProcedures.map(
          (prevMedicalProcedure: any) => {
            if (
              prevMedicalProcedure.medicalProcedureId === medicalProcedureId
            ) {
              return {
                medicalSpecialityId: "",
                originalMedicalSpeciality: medicalSpecialityId,

                currentGroupId: "123456",
                medicalProcedureId: prevMedicalProcedure.medicalProcedureId,
                medicalProcedureName: prevMedicalProcedure.medicalProcedureName,
                medicalProcedurePrice:
                  prevMedicalProcedure.medicalProcedurePrice,
              };
            } else {
              return prevMedicalProcedure;
            }
          }
        );
        return updatedMedicalProcedures;
      });
    }
  }

  const handleDrop = (e, updatedMedicalSpecialityId: string) => {
    handleGroupChange(
      dragData.medicalProcedureId,
      dragData.medicalSpecialityId,
      updatedMedicalSpecialityId
    );
    setIsDragging(false);
  };

  return (
    <div className="flex w-full items-center justify-between">
      {medicalSpecialities.length > 0 &&
        medicalSpecialities.map((medicalSpeciality) => (
          <div
            key={medicalSpeciality.medicalSpecialityId}
            className={`w-1/4 h-96 flex flex-col ${
              medicalSpeciality.medicalSpecialityId !== "123456"
                ? "border"
                : "border-dotted border-8"
            } overflow-y-scroll`}
            onDragEnter={(e) => handleDragEnter(e, medicalSpeciality)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, medicalSpeciality.medicalSpecialityId!)
            }
          >
            <div className="flex font-bold justify-center items-center mb-4">
              {medicalSpeciality.medicalSpecialityName}
            </div>

            <div className="w-full">
              {medicalProcedures.map((medicalProcedure) => (
                <div>
                  {medicalSpeciality.medicalSpecialityId ===
                    medicalProcedure.currentGroupId && (
                    <div
                      key={medicalProcedure.medicalProcedureId}
                      className="text-sm border mt-2"
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, medicalProcedure, medicalSpeciality)
                      }
                    >
                      {medicalProcedure.medicalProcedureName} - $
                      {medicalProcedure.medicalProcedurePrice}
                    </div>
                  )}

                  {/* {medicalProcedure.currentGroupId === "123456" && (
                    <div
                      key={medicalProcedure.medicalProcedureId}
                      className="text-sm border mt-2"
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, medicalProcedure, medicalSpeciality)
                      }
                    >
                      {medicalProcedure.medicalProcedureName} - $
                      {medicalProcedure.medicalProcedurePrice}
                      {!medicalProcedure.medicalSpecialityId ? "true" : "false"}
                      helooo
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
