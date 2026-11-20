import React, { useState } from "react";
import CalendarLib from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/cal.css"
import { useNotifications } from "../context/NotificationContext";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("Pending");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState("");

  const { addNotification } = useNotifications();

  // ➕ Add task
  const handleAddTask = () => {
    if (!task.trim()) return;
    const newTask = {
      task,
      date: date.toDateString(),
      status,
      time,
      details,
    };
    setTasks([...tasks, newTask]);
    addNotification(
      `📅 New: "${newTask.task}" on ${newTask.date} at ${time || "unspecified"}`
    );

    setTask("");
    setStatus("Pending");
    setTime("");
    setDetails("");
  };

  // ✏️ Edit task
  const handleEdit = (idx) => {
    const newTask = prompt("Edit task:", tasks[idx].task);
    if (newTask && newTask.trim()) {
      const updated = [...tasks];
      updated[idx].task = newTask;
      setTasks(updated);
      addNotification(`✏️ Updated: "${newTask}" (${updated[idx].date})`);
    }
  };

  // 🔄 Toggle status
  const toggleStatus = (idx) => {
    const updated = [...tasks];
    const order = ["Pending", "Ongoing", "Completed"];
    const currentIndex = order.indexOf(updated[idx].status);
    updated[idx].status = order[(currentIndex + 1) % order.length];
    setTasks(updated);
    addNotification(
      `🔄 Status: "${updated[idx].task}" → ${updated[idx].status}`
    );
  };

  // ❌ Delete task
  const handleDelete = (idx) => {
    const deletedTask = tasks[idx];
    setTasks(tasks.filter((_, i) => i !== idx));
    addNotification(`❌ Deleted: "${deletedTask.task}" (${deletedTask.date})`);
  };

  const tasksForDate = tasks.filter((t) => t.date === date.toDateString());

  return (
    <div className="calendar-page">
      <h1 classname="title">📅 Calendar & Tasks</h1>
      

      {/* Calendar */}
      <div className="calendar-wrapper">
        <CalendarLib value={date} onChange={setDate} />
      </div>

      {/* Task Input */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task / event"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
        <input
          type="text"
          placeholder="Additional details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button onClick={handleAddTask}>➕ Add</button>
      </div>

      {/* Tasks */}
      <h2>Tasks on {date.toDateString()}</h2>
      <div className="tasks-list">
        {tasksForDate.length === 0 ? (
          <p className="no-tasks">No tasks for this day.</p>
        ) : (
          tasksForDate.map((t, idx) => (
            <div key={idx} className={`task-card ${t.status.toLowerCase()}`}>
              <div className="task-info">
                <p className="task-title">{t.task}</p>
                {t.time && <p className="task-time">🕒 {t.time}</p>}
                {t.details && <p className="task-details">📝 {t.details}</p>}
                <p className="task-status">Status: {t.status}</p>
              </div>
              <div className="task-actions">
                <button onClick={() => toggleStatus(idx)} title="Toggle status">
                  🔄
                </button>
                <button onClick={() => handleEdit(idx)} title="Edit task">
                  ✏️
                </button>
                <button onClick={() => handleDelete(idx)} title="Delete task">
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
