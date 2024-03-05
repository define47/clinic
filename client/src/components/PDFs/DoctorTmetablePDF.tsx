import { FC } from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { AppointmentTableData, DoctorTimetablePDFProps } from "../../types";
import IatropolisLogo from "../../assets/logo-iatropolis.png";

export const DoctorTimetablePDF: FC<DoctorTimetablePDFProps> = ({
  appointments,
}) => {
  return (
    <Document>
      <Page size="A4" style={{ flexDirection: "column", padding: "25" }}>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          fixed
        >
          <View>
            {appointments.length > 0 && (
              <Text>
                {appointments[0].doctor.doctorForename}
                &nbsp;
                {appointments[0].doctor.doctorSurname}
              </Text>
            )}
          </View>
          <View style={{ width: "200px" }}>
            <Image src={IatropolisLogo} style={{ objectFit: "cover" }} />
          </View>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          fixed
        >
          <View style={{ width: "200px" }}>
            <Image src={IatropolisLogo} style={{ objectFit: "cover" }} />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          fixed
        >
          {appointments.length > 0 && <Text>Timetable</Text>}
        </View>

        <View fixed>
          {appointments.length > 0 && (
            <Text>
              {appointments[0].doctor.doctorForename}
              &nbsp;
              {appointments[0].doctor.doctorSurname}
            </Text>
          )}
        </View>

        {appointments.length > 0 &&
          appointments.map((appointment: AppointmentTableData) => (
            <View>
              <Text>{appointment.appointment.appointmentId}</Text>
              <Text>{appointment.appointment.appointmentDateTime}</Text>
            </View>
          ))}
        <Text
          style={{
            fontSize: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            width: "100%",
            height: "20px",
            marginTop: "auto",
            // marginRight: "auto",
            marginLeft: "270px",
          }}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};
