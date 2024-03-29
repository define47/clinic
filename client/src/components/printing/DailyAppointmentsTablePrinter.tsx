import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { appointmentsAPIPath } from "../../utils/dotenv";
import { AppointmentTableData, TableRow } from "../../types";
import { AppointmentHeader } from "../table/headers/AppointmentHeader";
import { AppointmentBody } from "../table/bodies/AppointmentBody";
import { useReactToPrint } from "react-to-print";
import { json } from "stream/consumers";
import IatropolisLogo from "../../assets/logo-iatropolis.png";

export const DailyAppointmentsTablePrinter: FC = () => {
  const [tableRows, setTableRows] = useState<AppointmentTableData[]>([]);
  const [orderByIndicator, setOrderByIndicator] = useState<string>("");
  const [clickedTableRow, setClickedTableRow] = useState<TableRow>();

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

  const tableRowsByDoctorId: Record<string, AppointmentTableData[]> = {};
  tableRows.forEach((tableRow) => {
    const doctorId = tableRow.doctor.doctorId;
    if (!tableRowsByDoctorId[doctorId]) {
      tableRowsByDoctorId[doctorId] = [];
    }
    tableRowsByDoctorId[doctorId].push(tableRow);
  });

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: () => console.log("print completed"),
  });

  return (
    <>
      <button className="text-black" onClick={handlePrint}>
        Print
      </button>
      <div ref={componentRef}>
        {/* Iterate over each doctorId and create a table */}
        {Object.keys(tableRowsByDoctorId).map((doctorId) => {
          const doctor = tableRowsByDoctorId[doctorId][0].doctor;
          return (
            <div
              key={doctorId}
              className="dailyAppointmentsTablePrinterContent "
            >
              <div className="w-full flex items-center justify-between dailyAppointmentsTablePrinterHeader doctorIdPrintingSeparator">
                <h4 className="">
                  {/* Doctor ID: {doctorId} */}
                  Dr. {doctor.doctorForename} {doctor.doctorSurname}
                </h4>
                <img
                  src={IatropolisLogo}
                  alt="Iatropolis, Botosani"
                  className="object-contain h-8 w-44"
                />
              </div>
              <table
                className="w-full text-center text-xs font-light border rounded-xl testTable"
                // style={{ pageBreakInside: "auto" }}
              >
                <thead className="w-full border-b border-lightMode-borderColor dark:border-darkMode-borderColor bg-lightMode-tableHeaderBackgroundColor dark:bg-darkMode-tableHeaderBackgroundColor font-medium">
                  <AppointmentHeader
                    orderByIndicator={orderByIndicator}
                    setOrderByIndicator={setOrderByIndicator}
                    isPrinting
                  />
                </thead>
                <tbody>
                  {tableRowsByDoctorId[doctorId].map(
                    (tableRow: AppointmentTableData, tableRowIndex: number) => (
                      <AppointmentBody
                        key={tableRowIndex}
                        tableRow={tableRow}
                        currentPage={0}
                        tableRowIndex={tableRowIndex}
                        clickedTableRow={clickedTableRow}
                        setClickedTableRow={setClickedTableRow}
                        tableLimit={99999}
                        isPrinting
                      />
                    )
                  )}
                </tbody>
              </table>
              {/* <footer className="footer"></footer> */}
            </div>
          );
        })}
      </div>
    </>
  );
};
