import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import StudyMaterials from "./pages/StudyMaterials";
import Assessments from "./pages/Assessments";
import AIContent from "./pages/AIContent";
import Calendar from "./pages/Calendar";
import CodeEditor from "./pages/CodeEditor";
import Collaboration from "./pages/Collaboration";
import Timer from "./pages/Timer";
import FileUpload from "./pages/FileUpload";
import MathTools from "./pages/MathTools";
import Formulas from "./pages/Formulas";
import Notes from "./pages/Notes";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Achievements from "./pages/Achievements";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const publicPaths = ["/", "/login", "/signup"];
  const isPublic = publicPaths.includes(location.pathname);

  if (user === undefined) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }

  return (
    <div className="app" style={{ display: "flex", height: "100vh" }}>
      {!isPublic && user && <Sidebar />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!isPublic && user && (
          <Topbar
            user={user}
            toggleDarkMode={() => {}}
            darkMode={false}
            onLogout={logout}
          />
        )}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected pages */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/study-materials" element={<PrivateRoute><StudyMaterials /></PrivateRoute>} />
            <Route path="/assessments" element={<PrivateRoute><Assessments /></PrivateRoute>} />
            <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
            <Route path="/code-editor" element={<PrivateRoute><CodeEditor /></PrivateRoute>} />
            <Route path="/collaboration" element={<PrivateRoute><Collaboration /></PrivateRoute>} />
            <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
            <Route path="/timer" element={<PrivateRoute><Timer /></PrivateRoute>} />
            <Route path="/math-tools" element={<PrivateRoute><MathTools /></PrivateRoute>} />
            <Route path="/ai-content" element={<PrivateRoute><AIContent /></PrivateRoute>} />
            <Route path="/formulas" element={<PrivateRoute><Formulas /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><Resources /></PrivateRoute>} />
            <Route path="/fileupload" element={<PrivateRoute><FileUpload /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/logout" element={<Logout onLogout={logout} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
