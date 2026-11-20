// Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupHero from "../assets/learning-hereo.png";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupClick = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword || !grade) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend to create user in users.db
      const res = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, grade, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        // User created in DB, now login in frontend
        const userObj = {
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          grade: data.user.grade,
        };
        const token = `mock-token-${data.user.id}`; // optional, replace if backend sends JWT
        login(userObj, token);

        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={signupHero} alt="Signup Hero" />
      </div>
      <div className="auth-right">
        <h1 className="auth-title">Create Account</h1>
        <div className="auth-form">
          <div className="form-group">
            <div className="floating-label">
              <input
                type="text"
                placeholder=" "
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <label>Username</label>
            </div>
          </div>
          <div className="form-group">
            <div className="floating-label">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
          </div>
          <div className="form-group">
            <div className="floating-label">
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className={grade ? "has-value" : ""}
              >
                <option value="">Select Grade</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num}>Grade {num}</option>
                ))}
                <option value="college">College</option>
              </select>
              <label>Grade</label>
            </div>
          </div>
          <div className="form-group">
            <div className="floating-label">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
          </div>
          <div className="form-group">
            <div className="floating-label">
              <input
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <label>Confirm Password</label>
            </div>
          </div>
          <button onClick={handleSignupClick} disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : "Signup"}
          </button>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
        </div>
        <div className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
