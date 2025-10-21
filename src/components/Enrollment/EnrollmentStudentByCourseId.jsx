import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const EnrollmentStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get(`/Enrollment/EnrollCoursesbyCourseId?Id=${id}`);
      setEnrollments(response.data);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      alert("Failed to fetch enrollment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Enrolled Students</h2>

        {enrollments.length === 0 ? (
          <p className="text-center text-gray-500">No students enrolled yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Course Name</th>
                <th className="border p-3 text-left">Student Name</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-3">{item.courseName}</td>
                  <td className="border p-3">{item.studentName}</td>
                  <td className="border p-3">
                    {new Date(item.enrolledDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentStudent;
