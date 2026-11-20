// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginHero from "../assets/learning-hereo.png";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../utils/userUtils";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    setError("");
    
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Get all users (including new ones from localStorage)
      const users = getUsers();
      
      // Find user by email in our users data
      const user = users.find(u => u.email === email);
      
      if (user && user.password === password) {
        // Create user object for auth context
        const userObj = {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
          grade: user.grade
        };
        
        // Use a mock token
        const token = `mock-token-${user.id}`;
        
        // Login using auth context
        login(userObj, token);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={loginHero} alt="Login Hero" />
      </div>
      <div className="auth-right">
        <h1 className="auth-title">Welcome Back</h1>
        <div className="auth-form">
          <div className="floating-label">
            <input 
              type="email" 
              placeholder=" " 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <label>Email</label>
          </div>
          <div className="floating-label">
            <input 
              type="password" 
              placeholder=" " 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <label>Password</label>
          </div>
          <button onClick={handleLoginClick} disabled={isLoading}>
            {isLoading ? <span className="loading-spinner"></span> : "Login"}
          </button>
          {error && <p className="auth-error">{error}</p>}
        </div>
        <div className="auth-footer">
          Don't have an account? <span className="auth-link" onClick={() => navigate("/signup")}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;