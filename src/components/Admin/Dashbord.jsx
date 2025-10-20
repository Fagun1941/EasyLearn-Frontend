import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/users")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
        >
          👥 See All Users
        </button>

        <button
          onClick={() => navigate("/TeacherList")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
        >
          📚 See All Teachers
        </button>
        <button
          onClick={() => navigate("/teachesRequests")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105"
        >
          🧾 Pending Teacher Requests
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
