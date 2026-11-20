import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/components.css';

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      alert("Please login first!");
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Knowtix</div>
      <ul className="nav-links">
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><button onClick={handleDashboardClick} className="dashboard-btn">Dashboard</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
