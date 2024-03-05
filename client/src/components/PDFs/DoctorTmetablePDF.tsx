import { FC, useEffect, useState } from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { AppointmentTableData, DoctorTimetablePDFProps } from "../../types";
import IatropolisLogo from "../../assets/logo-iatropolis.png";

export const DoctorTimetablePDF: FC<DoctorTimetablePDFProps> = ({
  appointments,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>();

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

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
            <Image src={IatropolisLogo} style={{ objectFit: "contain" }} />
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
          {appointments.length > 0 && (
            <Text>
              Timetable&nbsp;{appointments[0].doctor.doctorForename}&nbsp;
              {appointments[0].doctor.doctorSurname} (
              {currentDate
                ?.toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("-")}
              )
            </Text>
          )}
        </View>

        {/* <View fixed>
          {appointments.length > 0 && (
            <Text>
              {appointments[0].doctor.doctorForename}
              &nbsp;
              {appointments[0].doctor.doctorSurname}
            </Text>
          )}
        </View> */}

        <View
          style={{
            flexDirection: "row",
            border: 1,
            borderColor: "black",
            height: 25,
          }}
          fixed
        >
          {/* <View style={{ width: "25%", borderRight: 1, textAlign: "center" }}>
            <Text style={{ fontSize: 10 }}>Doctor</Text>
          </View> */}
          <View
            style={{
              width: "42.5%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRight: 1,
            }}
          >
            <Text style={{ fontSize: 10 }}>Patient</Text>
          </View>
          <View
            style={{
              width: "15%",
              borderRight: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10 }}>Appointment Time</Text>
          </View>
          <View
            style={{
              width: "42.5%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 10 }}>Comments</Text>
          </View>
        </View>

        {appointments.length > 0 &&
          appointments.map(
            (appointment: AppointmentTableData, appointmentIndex: number) => (
              // <View>
              //   <Text>{appointment.appointment.appointmentId}</Text>
              //   <Text>{appointment.appointment.appointmentDateTime}</Text>
              // </View>
              <View
                style={{
                  flexDirection: "row",
                  // border: 1,
                  borderColor: "black",
                  height: 21,
                }}
              >
                <View
                  style={{
                    width: "42.5%",
                    borderLeft: 1,
                    borderRight: 1,
                    borderBottom: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 10 }}>
                    {appointment.patient.patientForename}&nbsp;
                    {appointment.patient.patientSurname}&nbsp;{appointmentIndex}
                  </Text>
                </View>
                <View
                  style={{
                    width: "15%",
                    borderRight: 1,
                    borderBottom: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 10 }}>
                    {/* {appointment.appointmentDateTime
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")}
                  &nbsp; */}
                    {appointment.appointment.appointmentDateTime
                      .split("T")[1]
                      .substring(0, 5)}
                  </Text>
                </View>
                <View
                  style={{
                    width: "42.5%",
                    textAlign: "center",
                    borderBottom: 1,
                    borderRight: 1,
                  }}
                ></View>
              </View>
            )
          )}

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
