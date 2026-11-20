import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import heroImg from "../assets/dash.png";
import "../styles/dashboard.css";

const Dashboard = () => {
  const weeklyPerformance = [
    { day: "Mon", subject: "Maths", hours: 2, marks: 75 },
    { day: "Tue", subject: "Science", hours: 3, marks: 80 },
    { day: "Wed", subject: "English", hours: 4, marks: 65 },
    { day: "Thu", subject: "GK", hours: 3, marks: 90 },
    { day: "Fri", subject: "History", hours: 5, marks: 70 },
    { day: "Sat", subject: "Geography", hours: 2, marks: 85 },
    { day: "Sun", subject: "Computer", hours: 1, marks: 60 },
  ];

  const dailyScores = [
    { day: "Mon", subject: "Maths", hours: 2, marks: 75 },
    { day: "Tue", subject: "Science", hours: 3, marks: 80 },
    { day: "Wed", subject: "English", hours: 4, marks: 65 },
    { day: "Thu", subject: "GK", hours: 3, marks: 90 },
    { day: "Fri", subject: "History", hours: 5, marks: 70 },
    { day: "Sat", subject: "Geography", hours: 2, marks: 85 },
    { day: "Sun", subject: "Computer", hours: 1, marks: 60 },
  ];

  const monthlyPerformance = [
    { month: "Jan", subject: "Maths", hours: 40, marks: 78 },
    { month: "Feb", subject: "Science", hours: 50, marks: 82 },
    { month: "Mar", subject: "English", hours: 35, marks: 68 },
    { month: "Apr", subject: "GK", hours: 60, marks: 88 },
    { month: "May", subject: "History", hours: 45, marks: 72 },
    { month: "Jun", subject: "Computer", hours: 55, marks: 84 },
  ];

  const subjectScores = [
    { subject: "Math", hours: 40, marks: 80 },
    { subject: "Science", hours: 35, marks: 70 },
    { subject: "English", hours: 45, marks: 90 },
    { subject: "GK", hours: 30, marks: 60 },
  ];

  const studyResources = [
    "Math Formulas", "Science Experiments", "English Grammar", "GK Notes",
    "Programming Basics", "Data Structures", "AI Concepts", "Project Ideas"
  ];

  const COLORS = ["#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"];

  // Custom tooltip for all charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "14px"
        }}>
          <p><strong>{label || data.subject}</strong></p>
          <p>Subject: {data.subject}</p>
          <p>Hours Spent: {data.hours}</p>
          <p>Marks: {data.marks}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-wrapper">
      <motion.div
        className="dashboard-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={heroImg} alt="Learning Hero" className="hero-img" />
        <div className="hero-text">
          <h1>Welcome back, Achu!</h1>
          <p>Track your learning progress and stay ahead!</p>
        </div>
      </motion.div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <div className="card-grid">
            {/* Weekly Performance */}
            <ChartCard title="Weekly Performance">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="hours" stroke="#FF7F50" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Daily Scores */}
            <ChartCard title="Daily Scores">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="marks" radius={[8, 8, 0, 0]}>
                    {dailyScores.map((entry, index) => (
                      <Cell key={index} fill={
                        entry.marks >= 85 ? "#1E90FF" :
                        entry.marks >= 75 ? "#32CD32" :
                        entry.marks >= 65 ? "#FFA500" : "#FF4C4C"
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Monthly Performance */}
            <ChartCard title="Monthly Performance">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#1E90FF" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Subject Scores */}
            <ChartCard title="Subject Scores">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={subjectScores} dataKey="marks" nameKey="subject" outerRadius={100} label>
                    {subjectScores.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="dashboard-right">
          <div className="card calendar-card">
            <h3>Calendar</h3>
            <Calendar />
          </div>

          <div className="card resources-card">
            <h3>Quick Resources</h3>
            <div className="resources-list">
              {studyResources.map((r, i) => (
                <span key={i} className="resource-badge">{r}</span>
              ))}
            </div>

            <div className="edu-quote">
              <p>"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="card square-card">
    <h3>{title}</h3>
    {children}
  </div>
);

export default Dashboard;
