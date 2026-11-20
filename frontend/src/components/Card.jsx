import React from 'react';
import '../styles/components.css';

// Props example:
// type: 'task' | 'badge' | 'progress' | 'scoreboard' | 'files'
// data: object or array depending on type
const Card = ({ type, title, data }) => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="dashboard-card card">
      <h3 className="card-title">{title}</h3>

      {type === 'task' && (
        <ul className="task-list">
          {data.map((task, i) => (
            <li key={i} className={`task-item ${task.status}`}>
              <span>{task.name}</span>
              <span>{task.hours} hrs</span>
            </li>
          ))}
        </ul>
      )}

      {type === 'badge' && (
        <div className="badge-display">
          <span className={`badge ${data.level}`}>{data.name}</span>
          <p className="badge-date">Achieved: {data.date}</p>
        </div>
      )}

      {type === 'progress' && (
        <div className="progress-container">
          <p className="progress-date">Today: {today}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>
          <p className="progress-percent">{data.progress}% completed</p>
        </div>
      )}

      {type === 'scoreboard' && (
        <ul className="score-list">
          {data.map((item, i) => (
            <li key={i}>
              {item.name}: <strong>{item.score}</strong>
            </li>
          ))}
        </ul>
      )}

      {type === 'files' && (
        <ul className="files-list">
          {data.map((file, i) => (
            <li key={i}>📄 {file}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Card;
