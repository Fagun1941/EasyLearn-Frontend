import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { getUserFromToken } from "../../utils/auth";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const user = getUserFromToken();
        //alert("User ID: " + (user ? user.userId : "No user"));
        if (!user || !user.userId) {
          alert("User not found! Please login again.");
          return;
        }

        const response = await api.get(`/Course/GetByTeacherId/${user.userId}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No courses found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="bg-white p-5 shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">{course.title}</h3>
            <p className="text-gray-500 mt-1">{course.categoryName}</p>
            <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 font-semibold">${course.price}</span>
              <span className="text-sm text-gray-400">By {course.teacherName}</span>
              <p>
            
          </p>
            </div>

            {/* Details Button */}
            <button
              onClick={() => navigate(`/course/details/${course.courseId}`)}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
