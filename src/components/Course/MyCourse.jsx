import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { getUserFromToken } from "../../utils/auth";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSoftDeleted, setShowSoftDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const user = getUserFromToken();
        if (!user || !user.userId) {
          alert("User not found! Please login again.");
          return;
        }

        let url = `/Course/GetByTeacherId/${user.userId}`;
        if (showSoftDeleted) {
          url = `/Course/GetAllSoftDeletedCourse?Id=${user.userId}`;
        }

        const response = await api.get(url);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [showSoftDeleted]);

  const handlePermanentDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to permanently delete this course?")) {
      try {
        await api.delete(`/Course/DeletePermanent/${courseId}`);
        alert("Course permanently deleted!");
        setCourses(courses.filter(c => c.courseId !== courseId));
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course");
      }
    }
  };

  const handleRestore = async (courseId) => {
    try {
      await api.patch(`/Course/RestoreCourse/${courseId}`);
      alert("Course restored successfully!");
      setCourses(courses.filter(c => c.courseId !== courseId));
    } catch (error) {
      console.error("Failed to restore course:", error);
      alert("Failed to restore course");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        {showSoftDeleted ? "No soft-deleted courses found." : "No courses found."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
        <button
          onClick={() => setShowSoftDeleted(!showSoftDeleted)}
          className={`px-4 py-2 rounded transition ${
            showSoftDeleted ? "bg-red-600 text-white" : "bg-gray-300"
          }`}
        >
          {showSoftDeleted ? "Show Active Courses" : "Show Deleted Courses"}
        </button>
      </div>

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
            </div>

            {showSoftDeleted ? (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleRestore(course.courseId)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(course.courseId)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Permanently Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(`/course/details/${course.courseId}`)}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Details
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
