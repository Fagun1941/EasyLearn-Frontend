import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth"; 
import api from "../../api/axiosConfig";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getUserFromToken();
    if (storedUser) setUser(storedUser.userName);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/Account/logout"); 
      alert("Logged out successfully");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      alert("You have been logged out.");
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
    

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center mt-20">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to EasyLearn 🎓</h1>
        <p className="text-gray-600 mt-4 text-lg">
          Learn anything, anytime, anywhere with interactive courses.
        </p>
        <button
          onClick={() => navigate("/course")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Explore Courses
        </button>
      </main>
    </div>
  );
};

export default Home;
