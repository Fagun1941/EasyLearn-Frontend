import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/Admin/users"); 
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
       await api.delete(`/Admin/Delete-User?userId=${userId}`);
        alert("User deleted successfully!");
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loading]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No users found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        All Users
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{user.userName}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.role}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
