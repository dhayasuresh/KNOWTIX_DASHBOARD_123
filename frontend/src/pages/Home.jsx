import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/home.png";
import "../styles/home.css"
import Navbar from "../components/Navbar";

const Home = ({ isLoggedIn }) => {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="home">
        <div className="home-left">
          <h1>Upgrade Your Learning</h1>
          <p>Join thousands of learners improving their skills with modern e-learning.</p>
          <Link to="/login">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
        <div className="home-right">
          <img src={heroImage} alt="E-learning Illustration" />
        </div>
      </div>
    </>
  );
};

export default Home;
