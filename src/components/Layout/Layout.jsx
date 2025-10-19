import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import api from "../../api/axiosConfig";

const Layout = () => {
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
      <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-semibold hover:underline">
            Home
          </Link>
          <Link to="/Admin" className="hover:underline">
            Admin
          </Link>
          <Link to="/category" className="hover:underline">
            Category
          </Link>
          <Link to="/course" className="hover:underline">
            Course
          </Link>
          <Link to="/my-course" className="hover:underline">
            My Courses
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="font-medium">{user}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
