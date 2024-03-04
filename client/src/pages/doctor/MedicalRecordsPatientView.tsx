import { FC, useEffect, useState } from "react";
import { MedicalRecordPatientBookPage } from "./MedicalRecordPatientBookPage";
import { MedicalRecordPatientBookPageData } from "../../types";
import axios from "axios";
import { medicalRecordsPatientsAPIPath } from "../../utils/dotenv";

export const MedicalRecordsPatientView: FC = () => {
  const [data, setData] = useState<MedicalRecordPatientBookPageData[]>([]);
  const [firstHalf, setFirstHalf] = useState<
    MedicalRecordPatientBookPageData[]
  >([]);
  const [secondHalf, setSecondHalf] = useState<
    MedicalRecordPatientBookPageData[]
  >([]);
  const [currentLocation, setCurrentLocation] = useState<number>(0);
  const [numOfPapers, setNumOfPapers] = useState<number>(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(medicalRecordsPatientsAPIPath, {
          params: {
            doctorId: "c390e5d2-0c85-5e45-92eb-5486c7a564a1",
            patientId: "1557eff8-89ef-583d-854e-bbb262025bbe",
          },
          withCredentials: true,
        });
        if (response.data.success) {
          setData(response.data.payload);
          const halfIndex = Math.ceil(response.data.payload.length / 2);
          setFirstHalf(response.data.payload.slice(0, halfIndex));
          setSecondHalf(response.data.payload.slice(halfIndex));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentLocation(0);
    setNumOfPapers(data.length);
    console.log("data.length", data.length);
  }, [data]);

  function goNextPage() {
    if (currentLocation < numOfPapers) {
      setCurrentLocation(currentLocation + 1);
    }
  }

  function goPrevPage() {
    if (currentLocation >= 0) setCurrentLocation(currentLocation - 1);
  }

  const indices = [];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="absolute top-0">
        {currentLocation} Z:{numOfPapers - currentLocation}
      </span>
      <div
        className={`flex items-center justify-center ${
          currentLocation >= 1 ? "absolute translate-x-96 duration-500" : ""
        }`}
      >
        <button
          className={`text-black ${
            currentLocation >= 1
              ? "-translate-x-[790px] duration-500"
              : "duration-500"
          }`}
          onClick={goPrevPage}
        >
          previous page
        </button>

        <div id="book" className="book">
          {firstHalf.length > 0 &&
            firstHalf.map(
              (piece: MedicalRecordPatientBookPageData, index: number) => {
                if (!indices.includes(index)) {
                  // indices.push(index);
                  return (
                    <div
                      id="p1"
                      className={`paper ${
                        currentLocation >= index + 1 ? "flipped" : ""
                      }`}
                      style={{
                        zIndex: `${
                          currentLocation >= index + 1
                            ? currentLocation
                            : numOfPapers - currentLocation - index + 10
                        }`,
                      }}
                    >
                      <div className={`front overflow-y-scroll`}>
                        <div id="f1" className={`front-content`}>
                          {/* Front {index} {numOfPapers - index} */}

                          <MedicalRecordPatientBookPage
                            appointmentT={firstHalf[index].appointment}
                            medicalRecordPatientT={
                              firstHalf[index].medicalRecordPatient
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            )}
          {secondHalf.length > 0 &&
            secondHalf.map(
              (piece: MedicalRecordPatientBookPageData, index: number) => {
                if (!indices.includes(index)) {
                  // indices.push(index);
                  return (
                    <div
                      id="p1"
                      className={`paper ${
                        currentLocation >= index + 1 ? "flipped" : ""
                      }`}
                      style={{
                        zIndex: `${
                          currentLocation >= index + 1
                            ? currentLocation
                            : numOfPapers - currentLocation - index
                        }`,
                      }}
                    >
                      <div className={`back overflow-y-scroll`}>
                        <div id="b1" className={`back-content`}>
                          {/* Front {index} {numOfPapers - index} */}

                          <MedicalRecordPatientBookPage
                            appointmentT={secondHalf[index].appointment}
                            medicalRecordPatientT={
                              secondHalf[index].medicalRecordPatient
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            )}
        </div>

        <button className="text-black" onClick={() => goNextPage()}>
          next page
        </button>
      </div>
    </div>
  );
};
