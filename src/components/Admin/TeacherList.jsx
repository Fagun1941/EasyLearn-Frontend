import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchTeachers = async () => {
    try {
      const response = await api.get("/Admin/teachers"); 
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeacher = async (teacherId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this teacher?");
    if (!confirmDelete) return;

    try {
      await api.put(`Admin/Reject-Teacher?userId=${teacherId}`);
      alert("Teacher removed successfully!");
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    } catch (error) {
      console.error("Error removing teacher:", error);
      alert("Failed to remove teacher.");
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
              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{teacher.name || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{teacher.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleRemoveTeacher(teacher.id)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Remove Teacher
                  </button>
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
