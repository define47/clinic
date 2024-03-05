import { FC, useEffect, useState } from "react";
import { DailyAppointmentsTablePrinter } from "../../components/printing/DailyAppointmentsTablePrinter";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { DoctorTimetablePDF } from "../../components/PDFs/DoctorTmetablePDF";
import axios from "axios";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { AppointmentTableData } from "../../types";

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
            scheduleFilter: "today",

            customStartDate: "2024-02-09",
            customEndDate: "2024-02-09",
            orderBy: "asc:appointmentDateTime",
            limit: 9999999,
            page: 0,
            doctorId: "fe11da6e-91d7-54bd-b9f8-6714cb986df3",
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

  return (
    <div>
      {/* Admin Guide <RichTextEditor /> */}
      {/* <DailyAppointmentsTablePrinter /> */}
      <PDFDownloadLink
        document={<DoctorTimetablePDF appointments={tableRows} />}
        fileName="doctor_timetable.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>

      <PDFViewer width="100%" height="900px">
        <DoctorTimetablePDF appointments={tableRows} />
      </PDFViewer>
    </div>
  );
};
