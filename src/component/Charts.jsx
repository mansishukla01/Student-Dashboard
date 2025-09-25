import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA77", "#FF4444"];

export default function PieChartComponent({ students }) {
  const pieData = useMemo(() => students.map((s) => ({ name: s.name, value: s.marks })), [students]);

  return (
    <div style={{ width: "100%", height: "300px", marginTop: "30px" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
