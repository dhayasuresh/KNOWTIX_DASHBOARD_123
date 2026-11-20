import React, { useState, useEffect, useMemo } from "react";
import "../styles/achieve.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AchievementCard = ({ achievement, index }) => {
  return (
    <div 
      className="achievement-card" 
      style={{ animationDelay: `${index * 0.1}s` }}
      title={achievement.desc}
    >
      <div
        className="achievement-icon"
        style={{ backgroundColor: achievement.color }}
      >
        {achievement.icon}
      </div>
      <h3>{achievement.title}</h3>
      <p>{achievement.desc}</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ 
            width: `${achievement.value}%`, 
            backgroundColor: achievement.color 
          }}
        ></div>
      </div>
      <div className="progress-value">{Math.round(achievement.value)}%</div>
    </div>
  );
};

const BadgeCard = ({ badge, percent }) => {
  return (
    <div className="badge-card" style={{ borderColor: badge.color }}>
      <div className="badge-inner">
        <span
          className="badge-icon"
          style={{ backgroundColor: badge.color }}
        >
          {badge.icon}
        </span>
        <div className="badge-info">
          <h3>{badge.label}</h3>
          <p>Awarded for scoring {percent}%</p>
        </div>
      </div>
      <div className="badge-shine"></div>
    </div>
  );
};

const generateAchievements = (score, total, percent, performance) => {
  return [
    {
      title: "Assessments Completed",
      desc: `You completed ${total} questions`,
      icon: "📄",
      color: "#6366f1",
      value: (score / total) * 100,
    },
    {
      title: "High Score",
      desc: `Scored ${percent}% in last quiz`,
      icon: "🏆",
      color: "#22c55e",
      value: percent,
    },
    {
      title: "Performance Level",
      desc: `Your performance was: ${performance}`,
      icon: performance === "Excellent" ? "🌟" : 
            performance === "Good" ? "👍" : "💡",
      color: performance === "Excellent" ? "#facc15" : 
             performance === "Good" ? "#3b82f6" : "#f97316",
      value: percent,
    }
  ];
};

const getBadge = (percent) => {
  if (percent >= 80)
    return { label: "Gold Badge", icon: "🥇", color: "#FFD700" };
  if (percent >= 50)
    return { label: "Silver Badge", icon: "🥈", color: "#C0C0C0" };
  return { label: "Bronze Badge", icon: "🥉", color: "#CD7F32" };
};

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

const Achievements = ({
  correct = 8,
  total = 10,
  percent = 80,
  performance = "Good",
}) => {
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState([]);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    const newAchievements = generateAchievements(
      correct,
      total,
      percent,
      performance
    );
    setAchievements(newAchievements);

    setProgress([
      { name: "Correct Answers", value: correct },
      { name: "Wrong Answers", value: total - correct },
    ]);

    setBadge(getBadge(percent));
  }, [correct, total, percent, performance]);

  const headerTitle = useMemo(() => "Your Learning Achievements", []);
  const headerSubtitle = useMemo(() => "Track your performance and earn badges 🎖️", []);

  return (
    <div className="page achievements-page">
      <div className="header-card">
        <h2>{headerTitle}</h2>
        <p>{headerSubtitle}</p>
        <div className="header-decoration"></div>
      </div>

      {badge && (
        <BadgeCard badge={badge} percent={percent} />
      )}

      <div className="cards-grid">
        {achievements.map((a, i) => (
          <AchievementCard key={i} achievement={a} index={i} />
        ))}
      </div>

      <div className="progress-card">
        <h3>Overall Progress</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={progress}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationDuration={1000}
                animationBegin={200}
              >
                {progress.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} answers`, '']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Achievements;