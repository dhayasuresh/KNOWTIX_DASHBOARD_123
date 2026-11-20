import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Logout = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    // Clear stored token and session data
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h1>Confirm Logout</h1>
        <p>Are you sure you want to log out of your account?</p>
        
        <div className="logout-actions">
          <button 
            onClick={() => setShowConfirm(true)} 
            className="logout-btn"
          >
            Yes, Logout
          </button>
          <button 
            onClick={() => navigate(-1)} 
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Final Confirmation</h3>
            <p>This will end your current session. Are you absolutely sure?</p>
            
            <div className="modal-actions">
              <button 
                onClick={handleLogout} 
                className="confirm-logout-btn"
              >
                Confirm Logout
              </button>
              <button 
                onClick={() => setShowConfirm(false)} 
                className="modal-cancel-btn"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;