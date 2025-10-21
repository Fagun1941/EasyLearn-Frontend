import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { getUserFromToken } from "../../utils/auth";

const MyEnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get user from token once
  const user = getUserFromToken();

  const fetchMyEnrollCourses = async () => {
    try {
      if (!user || !user.userId) {
        alert("User not found! Please login again.");
        return;
      }

      const response = await api.get(
        `/Enrollment/myEnrollCourses?id=${user.userId}`
      );
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      alert("Failed to load enrolled courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;

    try {
      await api.delete(`/Enrollment/unenroll?studentId=${user.userId}&courseId=${courseId}`);
      alert("Unenrolled successfully!");
      fetchMyEnrollCourses(); // ✅ Correct function call
    } catch (error) {
      console.error("Error during unenroll:", error);
      alert("Failed to unenroll");
    }
  };

  useEffect(() => {
    fetchMyEnrollCourses();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (courses.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        You haven’t enrolled in any courses yet.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        My Enrolled Courses
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-3 text-left">Course Title</th>
            <th className="border border-gray-300 p-3 text-left">Teacher</th>
            <th className="border border-gray-300 p-3 text-center">Enrolled Date</th>
            <th className="border border-gray-300 p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="border border-gray-300 p-3 font-medium">
                {course.courseName}
              </td>
              <td className="border border-gray-300 p-3">{course.teacherName}</td>
              <td className="border border-gray-300 p-3 text-center">
                {new Date(course.enrolledDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <button
                  onClick={() => handleUnenroll(course.courseId)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Unenroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyEnrollCourses;
