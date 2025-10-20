import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const PendingTeacherList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get("/Admin/Pending-teacherlist");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      alert("Failed to load pending teacher requests!");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this request?")) return;

    try {
      await api.post(`/Admin/approve-teacher/${userId}`);
      alert("Teacher approved successfully!");
      setRequests((prev) => prev.filter((r) => r.id !== userId));
    } catch (error) {
      console.error("Error approving teacher:", error);
      alert("Failed to approve teacher!");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;

    try {
      await api.put(`/Admin/Reject-Teacher?userId=${userId}`);
      alert("Teacher request rejected!");
      setRequests((prev) => prev.filter((r) => r.id !== userId));
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      alert("Failed to reject teacher!");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (requests.length === 0)
    return <p className="text-center mt-10 text-gray-600">No pending teacher requests.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
        Pending Teacher Requests
      </h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
               
              <td className="border border-gray-300 p-2">{r.userName}</td>
              <td className="border border-gray-300 p-2">{r.email}</td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <button
                  onClick={() => handleApprove(r.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                 
                  onClick={() => handleReject(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingTeacherList;
