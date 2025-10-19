import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const response = await api.get("/Admin/teachers"); 
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading teachers...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Teacher List</h2>

      {teachers.length === 0 ? (
        <p className="text-center text-gray-500">No teachers found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{teacher.fullName || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{teacher.email}</td>
                <td className="border border-gray-300 px-4 py-2">{teacher.phone || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      teacher.isApproved ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {teacher.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherList;
