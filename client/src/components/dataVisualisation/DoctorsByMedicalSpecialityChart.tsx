import axios from "axios";
import { FC, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generalDataPath } from "../../utils/dotenv";

export const DoctorsByMedicalSpecialityChart: FC = () => {
  const [dbData, setDbData] = useState<any>();

  const medicalSpecialityName = "medicalSpecialityName";
  const isPrimaryMedicalSpeciality = "primary";
  const isSecondaryMedicalSpeciality = "secondary";
  const isTertiaryMedicalSpeciality = "tertiary";
  const data = [
    {
      [medicalSpecialityName]: "Anesthesiology",
      [isPrimaryMedicalSpeciality]: 30,
      [isSecondaryMedicalSpeciality]: 70,
      [isTertiaryMedicalSpeciality]: 2,
    },
    {
      [medicalSpecialityName]: "B",
      [isPrimaryMedicalSpeciality]: 12,
      [isSecondaryMedicalSpeciality]: 88,
      [isTertiaryMedicalSpeciality]: 0,
    },
    {
      [medicalSpecialityName]: "C",
      [isPrimaryMedicalSpeciality]: 15,
      [isSecondaryMedicalSpeciality]: 85,
      [isTertiaryMedicalSpeciality]: 0,
    },
    {
      [medicalSpecialityName]: "D",
      [isPrimaryMedicalSpeciality]: 35,
      [isSecondaryMedicalSpeciality]: 65,
      [isTertiaryMedicalSpeciality]: 0,
    },
    {
      [medicalSpecialityName]: "E",
      [isPrimaryMedicalSpeciality]: 54,
      [isSecondaryMedicalSpeciality]: 46,
      [isTertiaryMedicalSpeciality]: 0,
    },
    {
      [medicalSpecialityName]: "F",
      [isPrimaryMedicalSpeciality]: 72,
      [isSecondaryMedicalSpeciality]: 28,
      [isTertiaryMedicalSpeciality]: 0,
    },
    {
      [medicalSpecialityName]: "G",
      [isPrimaryMedicalSpeciality]: 32,
      [isSecondaryMedicalSpeciality]: 68,
      [isTertiaryMedicalSpeciality]: 50,
    },
  ];

  const primaryColor = "#831843";
  const secondaryColor = "#be185d";
  const tertiaryColor = "#ec4899";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(generalDataPath, {
          params: {
            entity: "doctorMedicalSpecialityMappingsCountByMedicalSpeciality",
          },
          withCredentials: true,
        });

        console.log("here data", response.data.payload);

        setDbData(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="40%">
      <BarChart
        data={dbData}
        // width={"10%"}
        // height={250}
        layout="horizontal"
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 30,
        }}
        barSize={25}
        // barCategoryGap={35}
        // barCategoryGap={100}
      >
        <CartesianGrid />
        {/* <XAxis
          type="number"
          label={{
            value: "Number of Doctors",
            position: "insideBottom",
            offset: -15,
          }}
        />
        <YAxis
          dataKey="name"
          type="category"
          label={{
            value: "Medical Speciality",
            angle: -90,
            position: "insideLeft",
          }}
        /> */}
        <XAxis
          dataKey={medicalSpecialityName}
          label={{
            value: "Medical Speciality",
            position: "insideBottom",
            offset: -15,
          }}
        />
        <YAxis
          label={{
            value: "Number of Medical Specialities",
            angle: -90,
            position: "top",
            offset: -145,
          }}
        />
        <Tooltip
          cursor={{ stroke: "#ec4899", strokeWidth: 1 }}
          //   viewBox={{ x: 50, y: 0, width: 100, height: 200 }}
        />
        <Legend layout="horizontal" verticalAlign="top" align="right" />
        <Bar
          dataKey={isPrimaryMedicalSpeciality}
          stackId="a"
          fill={primaryColor}
          //   radius={[10, 0, 0, 10]}
          radius={[0, 0, 30, 30]}
          background={{ fill: "#e6edf4" }} // for that gray
        />
        <Bar
          dataKey={isSecondaryMedicalSpeciality}
          stackId="a"
          fill={secondaryColor}
          //   radius={[0, 0, 0, 0]}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey={isTertiaryMedicalSpeciality}
          stackId="a"
          fill={tertiaryColor}
          //   radius={[0, 10, 10, 0]}
          radius={[30, 30, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// import { FC } from "react";
// import { Pie, PieChart, Tooltip } from "recharts";

// export const DoctorsByMedicalSpecialityChart: FC = () => {
//   const data01 = [
//     {
//       name: "Group A",
//       value: 400,
//     },
//     {
//       name: "Group B",
//       value: 300,
//     },
//     {
//       name: "Group C",
//       value: 300,
//     },
//     {
//       name: "Group D",
//       value: 200,
//     },
//     {
//       name: "Group E",
//       value: 278,
//     },
//     {
//       name: "Group F",
//       value: 189,
//     },
//   ];
//   const data02 = [
//     {
//       name: "Group A",
//       value: 2400,
//     },
//     {
//       name: "Group B",
//       value: 4567,
//     },
//     {
//       name: "Group C",
//       value: 1398,
//     },
//     {
//       name: "Group D",
//       value: 9800,
//     },
//     {
//       name: "Group E",
//       value: 3908,
//     },
//     {
//       name: "Group F",
//       value: 4800,
//     },
//   ];

//   return (
//     <PieChart width={730} height={250}>
//       <Pie
//         data={data01}
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         outerRadius={50}
//         fill="#8884d8"
//       />
//       <Pie
//         data={data02}
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         innerRadius={60}
//         outerRadius={80}
//         fill="#82ca9d"
//         label
//       />
//       <Tooltip />
//     </PieChart>
//   );
// };

// import { FC } from "react";
// import { Legend, RadialBar, RadialBarChart, Tooltip } from "recharts";

// export const DoctorsByMedicalSpecialityChart: FC = () => {
//   const data = [
//     {
//       name: "18-24",
//       uv: 31.47,
//       pv: 2400,
//       fill: "#8884d8",
//     },
//     {
//       name: "25-29",
//       uv: 26.69,
//       pv: 4567,
//       fill: "#83a6ed",
//     },
//     {
//       name: "30-34",
//       uv: -15.69,
//       pv: 1398,
//       fill: "#8dd1e1",
//     },
//     {
//       name: "35-39",
//       uv: 8.22,
//       pv: 9800,
//       fill: "#82ca9d",
//     },
//     {
//       name: "40-49",
//       uv: -8.63,
//       pv: 3908,
//       fill: "#a4de6c",
//     },
//     {
//       name: "50+",
//       uv: -2.63,
//       pv: 4800,
//       fill: "#d0ed57",
//     },
//     {
//       name: "unknow",
//       uv: 6.67,
//       pv: 4800,
//       fill: "#ffc658",
//     },
//   ];

//   return (
//     <RadialBarChart
//       width={730}
//       height={250}
//       innerRadius="10%"
//       outerRadius="80%"
//       data={data}
//       startAngle={180}
//       endAngle={0}
//     >
//       <RadialBar
//         label={{ fill: "#666", position: "insideStart" }}
//         background
//         dataKey="uv"
//       />
//       <Legend
//         iconSize={10}
//         width={120}
//         height={140}
//         layout="vertical"
//         verticalAlign="middle"
//         align="right"
//       />
//       <Tooltip />
//     </RadialBarChart>
//   );
// };
