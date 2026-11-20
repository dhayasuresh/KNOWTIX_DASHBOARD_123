import React, { useState } from "react";
import { FaMicrophone, FaBell, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";
import { useAuth } from "../context/AuthContext";
const Topbar = ({ user, darkMode, toggleDarkMode }) => {
  const currentUser = user || { name: "Guest", email: "N/A", grade: "N/A" };
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New study material added", read: false },
    { id: 2, message: "Weekly test reminder", read: false },
  ]);



  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🎤 Voice commands
  const handleVoiceCommand = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice commands not supported");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes("dashboard")) navigate("/dashboard");
      else if (command.includes("assessments")) navigate("/assessments");
      else if (command.includes("ai content")) navigate("/ai-content");
      else if (command.includes("calendar")) navigate("/calendar");
      else alert(`Command not recognized: ${command}`);
    };
  };

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  return (
    <div className={`topbar ${darkMode ? "dark" : ""}`}>
      <div className="topbar-left">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="topbar-right">
        {/* 🎤 Voice Assistant */}
        <button className="icon-btn" onClick={handleVoiceCommand}><FaMicrophone /></button>

        {/* 🔔 Notifications */}
        <div className="notif-wrapper">
          <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <FaBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="notif-dropdown">
              {notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`}>
                  {n.message}
                </div>
              ))}
              <button className="mark-read" onClick={markAllAsRead}>Mark all as read</button>
            </div>
          )}
        </div>

        {/* 🌙 / ☀️ Dark/Light Mode */}
        <button className="icon-btn" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* 👤 Profile */}
        <div className="profile-wrapper">
          <div className="user-info" onClick={() => setProfileOpen(!profileOpen)}>
            <span>{currentUser.name}</span>
            <FaUserCircle className="user-icon" />
          </div>
          {profileOpen && (
            <div className="profile-dropdown">
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Grade:</strong> {currentUser.grade}</p>
              <button onClick={() => navigate("/settings")}>Settings</button>
              <button onClick={() => navigate("/logout")}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
