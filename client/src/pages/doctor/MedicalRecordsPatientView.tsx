import { FC, useEffect, useState } from "react";
import { MedicalRecordPatientBookPage } from "./MedicalRecordPatientBookPage";
import { MedicalRecordPatientBookPageData } from "../../types";
import axios from "axios";
import { medicalRecordPatientsPath } from "../../utils/dotenv";

export const MedicalRecordsPatientView: FC = () => {
  const [data, setData] = useState<MedicalRecordPatientBookPageData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<number>(0);
  const [numOfPapers, setNumOfPapers] = useState<number>(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(medicalRecordPatientsPath, {
          params: {
            doctorId: "c390e5d2-0c85-5e45-92eb-5486c7a564a1",
            patientId: "1557eff8-89ef-583d-854e-bbb262025bbe",
            message: "medicalRecordsPatient",
          },
          withCredentials: true,
        });
        if (response.data.success) setData(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentLocation(0);
    setNumOfPapers(data.length);
  }, [data]);

  function goNextPage() {
    if (currentLocation < numOfPapers) {
      setCurrentLocation(currentLocation + 1);
    }
  }

  function goPrevPage() {
    if (currentLocation >= 0) setCurrentLocation(currentLocation - 1);
  }
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
          {data.length > 0 &&
            data.map(
              (piece: MedicalRecordPatientBookPageData, index: number) => (
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
                  <div className="front">
                    <div id="f1" className="front-content">
                      <h1>Front {index}</h1>
                    </div>
                  </div>
                  <div className="back overflow-y-scroll">
                    <div id="b1" className="back-content">
                      <h1>Back {index}</h1>
                      {/* <MedicalRecordPatientBookPage appointmentId="c2b45ff9-6639-50f7-8c36-7a0679012011" /> */}
                    </div>
                  </div>
                </div>
              )
            )}

          {/* <div
            id="p2"
            className={`paper ${currentLocation >= 2 ? "flipped" : ""}`}
            style={{
              zIndex: `${
                currentLocation >= 2
                  ? currentLocation
                  : numOfPapers - currentLocation
              }`,
            }}
          >
            <div className="front overflow-y-scroll">
              <div id="f2" className="front-content">
                <h1>Front 2</h1>
                <MedicalRecordPatientBookPage appointmentId="c2b45ff9-6639-50f7-8c36-7a0679012011" />
              </div>
            </div>
            <div className="back">
              <div id="b2" className="back-content">
                <h1>Back 2</h1>
              </div>
            </div>
          </div>

          <div
            id="p3"
            className={`paper ${currentLocation >= 3 ? "flipped" : ""}`}
            style={{
              zIndex: `${
                currentLocation >= 3
                  ? currentLocation
                  : numOfPapers - currentLocation - 1
              }`,
            }}
          >
            <div className="front">
              <div id="f3" className="front-content">
                <h1>Front 3</h1>
              </div>
            </div>
            <div className="back">
              <div id="b3" className="back-content">
                <h1>Back 3</h1>
              </div>
            </div>
          </div>

          <div
            id="p4"
            className={`paper ${currentLocation >= 4 ? "flipped" : ""}`}
            style={{
              zIndex: `${
                currentLocation >= 4
                  ? currentLocation
                  : numOfPapers - currentLocation - 2
              }`,
            }}
          >
            <div className="front">
              <div id="f4" className="front-content">
                <h1>Front 4</h1>
              </div>
            </div>
            <div className="back">
              <div id="b4" className="back-content">
                <h1>Back 4</h1>
              </div>
            </div>
          </div>

          <div
            id="p5"
            className={`paper ${currentLocation >= 5 ? "flipped" : ""}`}
            style={{
              zIndex: `${
                currentLocation >= 5
                  ? currentLocation
                  : numOfPapers - currentLocation - 3
              }`,
            }}
          >
            <div className="front">
              <div id="f5" className="front-content">
                <h1>Front 5</h1>
              </div>
            </div>
            <div className="back">
              <div id="b5" className="back-content">
                <h1>Back 5</h1>
              </div>
            </div>
          </div> */}
        </div>

        <button className="text-black" onClick={() => goNextPage()}>
          next page
        </button>
      </div>
    </div>
  );
};
