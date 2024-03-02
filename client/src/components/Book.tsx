import { FC, useEffect, useState } from "react";
import { MedicalRecordPatientBookPage } from "../pages/doctor/MedicalRecordPatientBookPage";

export const Book: FC = () => {
  const [currentLocation, setCurrentLocation] = useState<number>(0);
  const [numOfPapers, setNumOfPapers] = useState<number>(3);
  const [maxLocation, setMaxLocation] = useState<number>();

  useEffect(() => {
    setCurrentLocation(0);
    setNumOfPapers(3);
  }, []);

  useEffect(() => {
    setMaxLocation(numOfPapers + 1);
  }, [numOfPapers]);

  function goNextPage() {
    if (currentLocation < maxLocation) {
      setCurrentLocation(currentLocation + 1);
    }
  }

  function goPrevPage() {
    if (currentLocation >= 0) setCurrentLocation(currentLocation - 1);
  }

  return (
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
        <div
          id="p1"
          className={`paper ${currentLocation >= 1 ? "flipped z-10" : "z-30"}`}
        >
          <div className="front">
            <div id="f1" className="front-content">
              <h1>Front 1</h1>
            </div>
          </div>
          <div className="back overflow-y-scroll">
            <div id="b1" className="back-content">
              {/* <h1>Back 1</h1> */}
              <MedicalRecordPatientBookPage appointmentId="c2b45ff9-6639-50f7-8c36-7a0679012011" />
            </div>
          </div>
        </div>

        <div
          id="p2"
          className={`paper ${currentLocation >= 2 ? "flipped z-20" : "z-20"}`}
        >
          <div className="front overflow-y-scroll">
            <div id="f2" className="front-content">
              {/* <h1>Front 2</h1> */}
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
          className={`paper ${currentLocation >= 3 ? "flipped z-30" : "z-10"}`}
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
      </div>

      <button className="text-black" onClick={() => goNextPage()}>
        next page
      </button>
    </div>
  );
};

// import { FC, useEffect, useState } from "react";
// import { MedicalRecordPatientBookPage } from "../pages/doctor/MedicalRecordPatientBookPage";

// export const Book: FC = () => {
//   const [currentLocation, setCurrentLocation] = useState<number>(0);
//   const [numOfPapers, setNumOfPapers] = useState<number>(3);
//   const [maxLocation, setMaxLocation] = useState<number>();

//   useEffect(() => {
//     setCurrentLocation(0);
//     setNumOfPapers(3);
//   }, []);

//   useEffect(() => {
//     setMaxLocation(numOfPapers + 1);
//   }, [numOfPapers]);

//   function goNextPage() {
//     if (currentLocation < maxLocation) {
//       setCurrentLocation(currentLocation + 1);
//     }
//   }

//   function goPrevPage() {
//     if (currentLocation >= 0) setCurrentLocation(currentLocation - 1);
//   }

//   return (
//     <div
//       className={`flex items-center justify-center ${
//         currentLocation >= 1 ? "absolute translate-x-96 duration-500" : ""
//       }`}
//     >
//       <button
//         className={`text-black ${
//           currentLocation >= 1
//             ? "-translate-x-[790px] duration-500"
//             : "duration-500"
//         }`}
//         onClick={goPrevPage}
//       >
//         previous page
//       </button>

//       <div id="book" className="book">
//         <div
//           id="p1"
//           className={`paper ${currentLocation >= 1 ? "flipped z-10" : "z-30"}`}
//         >
//           <div className="front">
//             <div id="f1" className="front-content">
//               <h1>Front 1</h1>
//             </div>
//           </div>
//           <div className="back overflow-y-scroll">
//             <div id="b1" className="back-content">
//               <h1>Back 1</h1>
//             </div>
//           </div>
//         </div>

//         <div
//           id="p2"
//           className={`paper ${currentLocation >= 2 ? "flipped z-20" : "z-20"}`}
//         >
//           <div className="front overflow-y-scroll">
//             <div id="f2" className="front-content">
//               <h1>Front 2</h1>
//             </div>
//           </div>
//           <div className="back">
//             <div id="b2" className="back-content">
//               <h1>Back 2</h1>
//             </div>
//           </div>
//         </div>

//         <div
//           id="p3"
//           className={`paper ${currentLocation >= 3 ? "flipped z-30" : "z-10"}`}
//         >
//           <div className="front">
//             <div id="f3" className="front-content">
//               <h1>Front 3</h1>
//             </div>
//           </div>
//           <div className="back">
//             <div id="b3" className="back-content">
//               <h1>Back 3</h1>
//             </div>
//           </div>
//         </div>
//       </div>

//       <button className="text-black" onClick={() => goNextPage()}>
//         next page
//       </button>
//     </div>
//   );
// };
