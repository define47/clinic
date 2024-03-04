import axios from "axios";
import { FC, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generalDataAPIPath } from "../../utils/dotenv";

export const AppointmentAreaChart: FC = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(generalDataAPIPath, {
          params: {
            choice: "getTotalNumberOfAppointmentsPerPeriodPerEachDate",
            entity: "appointment",
            period: "month",
            doctorId: "",
            appointmentStatus: "",
          },
          withCredentials: true,
        });

        const transformedData = response.data.payload.map((entry: any) => ({
          date: entry.appointmentDateTime, // Assuming "appointmentDateTime" is the date field
          appointments: Number(entry.appointmentCount),
        }));

        console.log("transformedData:", transformedData);

        setData(transformedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  console.log("data:", data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-23}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 10 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend align="right" verticalAlign="top" layout="centric" />
        <Area
          type="monotone"
          dataKey="appointments"
          fill="#ffc2cd"
          stroke="#FF084A"
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
