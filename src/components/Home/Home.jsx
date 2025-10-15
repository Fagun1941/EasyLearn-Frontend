import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-semibold hover:underline">
            Home
          </Link>
          <Link to="/category" className="hover:underline">
            Category
          </Link>
          <Link to="/course" className="hover:underline">
            Course
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
