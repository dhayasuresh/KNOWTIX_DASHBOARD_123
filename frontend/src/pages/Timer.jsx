import React, { useState, useRef, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
import "../styles/pages.css"

const TimerStopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mode, setMode] = useState("stopwatch"); // 'stopwatch' or 'timer'
  const timerRef = useRef(null);

  // Format seconds to mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const start = () => {
    if (timerRef.current) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === "timer" && prev <= 0) {
          stop();
          return 0;
        }
        return mode === "timer" ? prev - 1 : prev + 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerRunning(false);
  };

  const reset = () => {
    stop();
    setSeconds(mode === "timer" ? 0 : 0);
  };

  const setPreset = (sec) => {
    setSeconds(sec);
    if (mode === "timer") stop();
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="page timer-page">
      <h1>{mode === "stopwatch" ? "Stopwatch" : "Timer"}</h1>

      <div className="card">
        <div className="time-display-wrapper">
          <FaRegClock className="clock-icon" />
          <h2 className="time-display">{formatTime(seconds)}</h2>
        </div>

        <div className="controls">
          <button onClick={start} disabled={timerRunning}>
            Start
          </button>
          <button onClick={stop} disabled={!timerRunning}>
            Stop
          </button>
          <button onClick={reset}>Reset</button>
        </div>

        {mode === "timer" && (
          <>
            <h3>Timer Presets</h3>
            <div className="presets">
              <button onClick={() => setPreset(60)}>1 min</button>
              <button onClick={() => setPreset(300)}>5 min</button>
              <button onClick={() => setPreset(600)}>10 min</button>
            </div>
          </>
        )}

        <h3>Mode</h3>
        <div className="presets">
          <button
            onClick={() => {
              reset();
              setMode("stopwatch");
            }}
          >
            Stopwatch
          </button>
          <button
            onClick={() => {
              reset();
              setMode("timer");
            }}
          >
            Timer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerStopwatch;
