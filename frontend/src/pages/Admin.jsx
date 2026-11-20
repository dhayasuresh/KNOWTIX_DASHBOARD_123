import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Settings, Search } from "lucide-react";
import "../styles/pages.css";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, content: 0 });
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch admin stats from backend
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("❌ Failed to load stats:", err);
      }
    };
    fetchStats();
  }, []);

  const adminOptions = [
    {
      title: "Manage Users",
      description: `Currently ${stats.users} users. Add, update, or remove users.`,
      icon: <Users size={40} className="text-blue-500" />,
      route: "/manage-users",
    },
    {
      title: "Manage Content",
      description: `Currently ${stats.content} study materials uploaded.`,
      icon: <FileText size={40} className="text-green-500" />,
      route: "/manage-content",
    },
    {
      title: "System Settings",
      description: "Configure security, backup, and system-wide preferences.",
      icon: <Settings size={40} className="text-purple-500" />,
      route: "/system-settings",
    },
  ];

  const filteredOptions = adminOptions.filter(option =>
    option.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Admin Dashboard ⚙️
        </h1>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredOptions.map((option, index) => (
          <div
            key={index}
            onClick={() => navigate(option.route)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transform transition duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              {option.icon}
              <h2 className="text-lg font-semibold">{option.title}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{option.description}</p>
            <button
              onClick={() => navigate(option.route)}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
