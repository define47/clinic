import { FC, useEffect, useState } from "react";
import { DailyAppointmentsTablePrinter } from "../../components/printing/DailyAppointmentsTablePrinter";
import ReactPDF, { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { DoctorTimetablePDF } from "../../components/PDFs/DoctorTmetablePDF";
import axios from "axios";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";
import PDFMerger from "pdf-merger-js/browser";
import { Document, Page, pdfjs } from "react-pdf";
import { Spinner } from "../../Spinners/Spinner";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const AdminGuide: FC = () => {
  const [tableRows, setTableRows] = useState<AppointmentTableData[]>([]);
  useEffect(() => {
    async function fetchTableData() {
      try {
        const response = await axios.get(appointmentsAPIPath, {
          params: {
            message: "appointments",
            searchInTable: "doctor",
            orderInTable: "appointment",
            searchBy: "userForename",
            searchQuery: "",
            scheduleFilter: "month",

            customStartDate: "2024-02-09",
            customEndDate: "2024-02-09",
            orderBy: "asc:appointmentDateTime",
            limit: 9999999,
            page: 0,
            doctorId: "",
            patientId: "",
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setTableRows(response.data.payload.tableData);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchTableData();
  }, []);

  const [mergedPdfUrl, setMergedPdfUrl] = useState<string>();
  const [pdfLinks, setPdfLinks] = useState<JSX.Element[]>([]);

  async function generatePDFsAllDoctors() {
    const files: JSX.Element[] = [];
    let tests = [];
    const tableRowsByDoctorId: Record<string, AppointmentTableData[]> = {};
    tableRows.forEach((tableRow) => {
      const doctorId = tableRow.doctor.doctorId;
      if (!tableRowsByDoctorId[doctorId]) {
        tableRowsByDoctorId[doctorId] = [];
      }
      tableRowsByDoctorId[doctorId].push(tableRow);
    });

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
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      );
      const blob = await ReactPDF.pdf(
        <DoctorTimetablePDF appointments={tableRowsByDoctorId[doctorIds[i]]} />
      ).toBlob();
      tests.push(blob);
      files.push(pdf);
    }

    const merger = new PDFMerger();
    await merger.setMetadata({
      producer: "Custom Producer",
      author: "Custom Author",
      creator: "Custom Creator",
      title: "Custom Title",
    });
    // await merger.save("this is the name of the pdf");

    for (const file of tests) {
      await merger.add(file);
    }

    const mergedPdf = await merger.saveAsBlob();

    const url = URL.createObjectURL(mergedPdf);

    setMergedPdfUrl(url);

    setPdfLinks(files);
  }

  useEffect(() => {
    generatePDFsAllDoctors();
  }, [tableRows]);

  return (
    <div>
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

      <Spinner />

      {/* <PDFViewer width="100%" height="900px">
        <DoctorTimetablePDF appointments={tableRows} />
      </PDFViewer> */}
      <div className="w-full">
        {/* <div className="w-full grid grid-cols-5">
          {pdfLinks.map((pdfLink: JSX.Element) => (
            <div className="col-span-1">{pdfLink}</div>
          ))}
        </div> */}

        {/* <button
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
        </button> */}

        {/* <iframe
          style={{ backgroundColor: "white" }}
          height={700}
          src={`${mergedPdfUrl}`}
          title="pdf-viewer"
          width="100%"
        ></iframe> */}

        {/* <embed
          style={{ backgroundColor: "white" }}
          height={700}
          src={`${mergedPdfUrl}`}
          title="pdf-viewer"
          width="100%"
          type="application/pdf"
        ></embed> */}

        {/* <Document file={mergedPdfUrl}>
          <Page pageNumber={5} />
        </Document> */}
      </div>
    </div>

    // <div>
    //   <PDFDownloadLink
    //     document={<DoctorTimetablePDF appointments={tableRows} />}
    //     fileName="doctor_timetable.pdf"
    //   >
    //     {({ blob, url, loading, error }) =>
    //       loading ? "Loading document..." : "Download now!"
    //     }
    //   </PDFDownloadLink>

    //   <PDFViewer width="100%" height="900px">
    //     <DoctorTimetablePDF appointments={tableRows} />
    //   </PDFViewer>
    // </div>
  );
};
