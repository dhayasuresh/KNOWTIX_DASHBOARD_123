import React, { useState, useEffect } from "react";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaVolumeUp,
  FaSave,
  FaChartLine,
  FaUser,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/settings.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = ({ darkMode, toggleDarkMode }) => {
  const { user, logout, login } = useAuth(); // get user from AuthContext
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) ?? true
  );
  const [voiceCommands, setVoiceCommands] = useState(
    JSON.parse(localStorage.getItem("voiceCommands")) ?? true
  );
  const [autoSave, setAutoSave] = useState(
    JSON.parse(localStorage.getItem("autoSave")) ?? true
  );
  const [studyReminders, setStudyReminders] = useState(
    JSON.parse(localStorage.getItem("studyReminders")) ?? false
  );
  const [weeklyScore, setWeeklyScore] = useState(
    JSON.parse(localStorage.getItem("weeklyScore")) || 72
  );
  const [studyInterest, setStudyInterest] = useState(
    JSON.parse(localStorage.getItem("studyInterest")) || {
      Math: 3,
      Science: 4,
      English: 5,
    }
  );
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");

  // Save settings in localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("voiceCommands", JSON.stringify(voiceCommands));
    localStorage.setItem("autoSave", JSON.stringify(autoSave));
    localStorage.setItem("studyReminders", JSON.stringify(studyReminders));
    localStorage.setItem("weeklyScore", JSON.stringify(weeklyScore));
    localStorage.setItem("studyInterest", JSON.stringify(studyInterest));
    localStorage.setItem("apiKey", apiKey);
  }, [
    notifications,
    voiceCommands,
    autoSave,
    studyReminders,
    weeklyScore,
    studyInterest,
    apiKey,
  ]);

  // Handle subject star rating
  const handleStarClick = (subject, index) => {
    setStudyInterest({ ...studyInterest, [subject]: index + 1 });
  };

  return (
    <div className={`settings-page ${darkMode ? "dark" : ""}`}>
      <h1>⚙️ Settings</h1>

      {/* USER DETAILS */}
      <div className="section">
        <h3>
          <FaUser /> User Details
        </h3>
        {user ? (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Grade:</strong> {user.grade || "College"}
            </p>
          </>
        ) : (
          <p>No user logged in</p>
        )}
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="section">
        <h3>
          <FaKey /> Account Settings
        </h3>
        <label>
          API Key:{" "}
          <input
            type=""
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <button
          className="btn logout"
          onClick={() => {
            logout(); // use context logout
            navigate("/login");
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* PREFERENCES */}
      <div className="section">
        <h3>Preferences</h3>
        <label>
          {darkMode ? <FaSun /> : <FaMoon />} Dark Mode{" "}
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        </label>
        <label>
          <FaBell /> Notifications{" "}
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </label>
        <label>
          <FaVolumeUp /> Voice Commands{" "}
          <input
            type="checkbox"
            checked={voiceCommands}
            onChange={() => setVoiceCommands(!voiceCommands)}
          />
        </label>
        <label>
          <FaSave /> Auto Save{" "}
          <input
            type="checkbox"
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
          />
        </label>
        <label>
          📅 Study Reminders{" "}
          <input
            type="checkbox"
            checked={studyReminders}
            onChange={() => setStudyReminders(!studyReminders)}
          />
        </label>
      </div>

      {/* WEEKLY SCORE */}
      <div className="section">
        <h3>
          <FaChartLine /> Weekly Test Score
        </h3>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{ width: `${weeklyScore}%` }}
          >{`${weeklyScore}%`}</div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={weeklyScore}
          onChange={(e) => setWeeklyScore(Number(e.target.value))}
        />
      </div>

      {/* STUDY INTERESTS */}
      <div className="section">
        <h3>Study Interests ⭐</h3>
        {Object.keys(studyInterest).map((sub) => (
          <div key={sub}>
            <span>{sub}: </span>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < studyInterest[sub] ? "star filled" : "star"}
                onClick={() => handleStarClick(sub, i)}
              >
                ★
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
