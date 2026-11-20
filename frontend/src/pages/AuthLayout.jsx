import React from "react";
import "../styles/auth.css";
import heroImg from "../assests/learning-hereo.png"; // Place your Freepik image in assets folder

const AuthLayout = ({ children, title, slogan }) => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="auth-title">{title}</h1>
        <p className="auth-slogan">{slogan}</p>
        {children}
      </div>
      <div className="auth-right">
        <img src={heroImg} alt="Learning Hero" />
      </div>
    </div>
  );
};

export default AuthLayout;
