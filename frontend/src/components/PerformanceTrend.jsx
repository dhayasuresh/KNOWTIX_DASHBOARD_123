import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import '../styles/components.css';

const data = [
  { week: "Week 1", score: 60 },
  { week: "Week 2", score: 72 },
  { week: "Week 3", score: 85 },
  { week: "Week 4", score: 90 },
];

export default function PerformanceTrend() {
  return (
    <div className="chart-container">
      <h3>Performance Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#5b21b6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
