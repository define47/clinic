import { FC, useEffect, useState } from "react";
import { DailyAppointmentsTablePrinter } from "../../components/printing/DailyAppointmentsTablePrinter";
import ReactPDF, { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { DoctorTimetablePDF } from "../../components/PDFs/DoctorTmetablePDF";
import axios from "axios";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";
import PDFMerger from "pdf-merger-js/browser";
import { Document, Page, pdfjs } from "react-pdf";
import { Spinner } from "../../Loaders/Spinner";
import { NumberPicker } from "../../components/pickers/NumberPicker";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const AdminGuide: FC = () => {
  // <div className="w-48">
  //   <NumberPicker />
  // </div>

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
  return <div></div>;
};
