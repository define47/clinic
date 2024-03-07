import ReactPDF, {
  PDFDownloadLink,
  PDFViewer,
  usePDF,
} from "@react-pdf/renderer";
import { FC, useContext, useEffect, useState } from "react";
import { DoctorTimetablePDF } from "../../components/PDFs/DoctorTmetablePDF";
import PDFMerger from "pdf-merger-js/browser";
import { AppointmentTableData } from "../../types";
import axios from "axios";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { Spinner } from "../../Loaders/Spinner";
import { UserPicker } from "../../components/pickers/UserPicker";
import { getItemByLanguageAndCollection } from "../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import Overlay from "../../components/overlays/base/Overlay";

export const DoctorTimetablePDFPage: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [tableRows, setTableRows] = useState<AppointmentTableData[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isData2Loading, setIsData2Loading] = useState<boolean>(false);
  const [isIFrameLoading, setIsIFrameLoading] = useState<boolean>(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [shouldMergedPDFBeFetched, setShouldMergedPDFBeFetched] =
    useState<boolean>(false);
  const [isPDFBeingGenerated, setIsPDFBeingGenerated] =
    useState<boolean>(false);
  const [instance, updateInstance] = usePDF();

  useEffect(() => {
    async function fetchTableData() {
      try {
        setIsDataLoading(true);
        const response = await axios.get(appointmentsAPIPath, {
          params: {
            message: "appointments",
            searchInTable: "doctor",
            orderInTable: "appointment",
            searchBy: "userForename",
            searchQuery: "",
            scheduleFilter: "today",

            customStartDate: "2024-02-09",
            customEndDate: "2024-02-09",
            orderBy: "asc:appointmentDateTime",
            limit: 9999999,
            page: 0,
            doctorId: shouldMergedPDFBeFetched ? "" : selectedDoctorId,
            patientId: "",
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setTableRows(response.data.payload.tableData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsDataLoading(false);
      }
    }
    if (selectedDoctorId !== "") fetchTableData();

    if (shouldMergedPDFBeFetched) fetchTableData();
  }, [shouldMergedPDFBeFetched, selectedDoctorId]);

  const [mergedPdfUrl, setMergedPdfUrl] = useState<string>();
  const [pdfLinks, setPdfLinks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function generatePDFsAllDoctors() {
      try {
        setIsData2Loading(true);
        const files: JSX.Element[] = [];
        let tests = [];
        // const tableRowsByDoctorId: Record<string, AppointmentTableData[]> = {};
        // tableRows.forEach((tableRow) => {
        //   const doctorId = tableRow.doctor.doctorId;
        //   if (!tableRowsByDoctorId[doctorId]) {
        //     tableRowsByDoctorId[doctorId] = [];
        //   }
        //   tableRowsByDoctorId[doctorId].push(tableRow);
        // });
        const tableRowsByDoctorId = tableRows.reduce((acc, tableRow) => {
          const doctorId = tableRow.doctor.doctorId;

          // Use the logical OR operator to initialize an empty array if it doesn't exist
          acc[doctorId] = acc[doctorId] || [];

          acc[doctorId].push(tableRow);
          return acc;
        }, {});

        const doctorIds = Object.keys(tableRowsByDoctorId);

        for (let i = 0; i < doctorIds.length; i++) {
          const pdf = (
            <PDFDownloadLink
              key={`${doctorIds[i]}`} // Make sure to provide a unique key
              document={
                <DoctorTimetablePDF
                  appointments={tableRowsByDoctorId[doctorIds[i]]}
                />
              }
              fileName="doctor_timetable.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  <Spinner />
                ) : (
                  `${
                    tableRowsByDoctorId[doctorIds[i]][0].doctor.doctorForename
                  } ${
                    tableRowsByDoctorId[doctorIds[i]][0].doctor.doctorSurname
                  }`
                )
              }
            </PDFDownloadLink>
          );
          const blob = await ReactPDF.pdf(
            <DoctorTimetablePDF
              appointments={tableRowsByDoctorId[doctorIds[i]]}
            />
          ).toBlob();
          tests.push(blob);
          files.push(pdf);
        }

        const merger = new PDFMerger();
        await merger.setMetadata({
          //   producer: "Custom Producer",
          //   author: "Custom Author",
          //   creator: "Custom Creator",
          title: "Doctors Timetable",
        });
        for (const file of tests) {
          await merger.add(file);
        }

        const mergedPdf = await merger.saveAsBlob();

        const url = URL.createObjectURL(mergedPdf);

        setMergedPdfUrl(url);

        setPdfLinks(files);
      } catch (error) {
        console.log(error);
      } finally {
        setIsData2Loading(false);
      }
    }

    if (shouldMergedPDFBeFetched) generatePDFsAllDoctors();
  }, [shouldMergedPDFBeFetched, tableRows]);

  // useEffect(() => {
  //   if (selectedDoctorId === "") setTableRows([]);
  // }, [selectedDoctorId]);

  const [doctorPdfURL, setDoctorPdfURL] = useState<string>("");

  useEffect(() => {
    console.log("tableRows", tableRows);
  }, [tableRows]);

  useEffect(() => {
    async function createURLPdf() {
      const blob = await ReactPDF.pdf(
        <DoctorTimetablePDF appointments={tableRows} />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      updateInstance(<DoctorTimetablePDF appointments={tableRows} />);
      setDoctorPdfURL(url);
    }

    if (selectedDoctorId !== "" && !shouldMergedPDFBeFetched) createURLPdf();
  }, [selectedDoctorId, tableRows, shouldMergedPDFBeFetched]);

  return (
    <div className="w-full h-full">
      <Overlay
        className={`fixed inset-0 flex justify-center items-center bg-black/30 transition-opacity z-50  ${
          isDataLoading || isData2Loading || instance.loading
            ? "visible"
            : "invisible"
        }`}
        // closeModal={() => setIsCreateUserOverlayVisible(false)}
        closeModal={() => {}}
      >
        <div>
          <Spinner />
        </div>
      </Overlay>

      {/* {Object.keys(tableRowsByDoctorId).map((doctorId) =>
        tableRowsByDoctorId[doctorId].map(
          (tableRow: AppointmentTableData, tableRowIndex: number) => (
            <PDFDownloadLink
              key={`${doctorId}-${tableRowIndex}`} // Make sure to provide a unique key
              document={
                <DoctorTimetablePDF
                  appointments={tableRowsByDoctorId[doctorId]}
                />
              }
              fileName="doctor_timetable.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          )
        )
      )} */}

      <div className="flex items-center justify-center mb-10">
        <div
          className="w-full lg:w-1/4"
          onClick={() => {
            setShouldMergedPDFBeFetched(false);
            setMergedPdfUrl("");
          }}
        >
          <UserPicker
            shouldDataBeFetched={true}
            label={getItemByLanguageAndCollection(
              authenticatedUserDataState.language.languageCode,
              "appointmentTableColumnNames",
              0
            )}
            roleName="doctor"
            selectedUserId={selectedDoctorId}
            setSelectedUserId={setSelectedDoctorId}
            selectedUserName={selectedDoctorName}
            setSelectedUserName={setSelectedDoctorName}
            z="z-40"
            disabled={false}
          />
        </div>
        <button
          className="text-black"
          onClick={() => {
            setShouldMergedPDFBeFetched(true);
            setSelectedDoctorName("");
            setDoctorPdfURL("");
          }}
        >
          All
        </button>
      </div>

      {!shouldMergedPDFBeFetched && selectedDoctorId !== "" && (
        <div className="">
          {/* <PDFDownloadLink
            document={<DoctorTimetablePDF appointments={tableRows} />}
            fileName="doctor_timetable.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? <Spinner /> : `${selectedDoctorName}`
            }
          </PDFDownloadLink> */}

          {!instance.loading && (
            <a href={instance.url} download="test.pdf">
              Download
            </a>
          )}

          {/* <PDFViewer width="100%">
            <DoctorTimetablePDF appointments={tableRows} />
          </PDFViewer> */}

          {isIFrameLoading && <Spinner />}

          {doctorPdfURL && (
            <div
              className={`${
                isIFrameLoading || isDataLoading ? "invisible" : "block"
              }`}
            >
              <div className="">
                <iframe
                  height={700}
                  src={`${doctorPdfURL}`}
                  title="pdf-viewer"
                  width="100%"
                  onLoad={() => {
                    setIsIFrameLoading(false);
                  }}
                  onError={() => {
                    setIsIFrameLoading(false);
                  }}
                ></iframe>
                {/* <embed
                  style={{ backgroundColor: "white" }}
                  height={700}
                  src={`${doctorPdfURL}`}
                  title="pdf-viewer"
                  width="100%"
                  type="application/pdf"
                  onLoad={() => {
                    setIsIFrameLoading(false);
                  }}
                  onError={() => {
                    setIsIFrameLoading(false);
                  }}
                ></embed> */}
              </div>
            </div>
          )}
        </div>
      )}

      {shouldMergedPDFBeFetched && (
        <>
          {isDataLoading && <Spinner />}

          {!isDataLoading && (
            <div className="w-full">
              {/* <div className="w-full grid grid-cols-5">
                {pdfLinks.map((pdfLink: JSX.Element) => (
                  <div className="col-span-1">{pdfLink}</div>
                ))}
              </div> */}

              {!isData2Loading && (
                <button
                  className="text-black"
                  onClick={() => {
                    if (mergedPdfUrl) {
                      const link = document.createElement("a");
                      link.href = mergedPdfUrl;
                      link.download = "downloaded_file.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  Download Merged PDF
                </button>
              )}

              {isIFrameLoading && <Spinner />}

              {mergedPdfUrl !== "" && (
                <div
                  className={`${
                    isIFrameLoading || isDataLoading ? "invisible" : "block"
                  }`}
                >
                  <iframe
                    height={700}
                    src={`${mergedPdfUrl}`}
                    title="pdf-viewer"
                    width="100%"
                    onLoad={() => {
                      setIsIFrameLoading(false);
                    }}
                    onError={() => {
                      setIsIFrameLoading(false);
                    }}
                  ></iframe>
                  {/* <embed
                  style={{ backgroundColor: "white" }}
                  height={700}
                  src={`${mergedPdfUrl}`}
                  title="pdf-viewer"
                  width="100%"
                  type="application/pdf"
                  onLoad={() => {
                    setIsIFrameLoading(false);
                  }}
                  onError={() => {
                    setIsIFrameLoading(false);
                  }}
                ></embed> */}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
