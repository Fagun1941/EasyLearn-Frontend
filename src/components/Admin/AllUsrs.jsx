import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const pageSizeOptions = [3, 5, 10, 20, 30, 50];

  const fetchUsers = async (pageNumber = 1, selectedPageSize = pageSize) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/Admin/users?page=${pageNumber}&pageSize=${selectedPageSize}`
      );
      const { items, totalPages, currentPage } = response.data;
      setUsers(items || []);
      setTotalPages(totalPages || 1);
      setPage(currentPage || 1);
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
        fetchUsers(page, pageSize); // refresh
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize);
  }, [page, pageSize]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No users found.</p>;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        All Users
      </h2>

      {/* Page Size Selector */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium text-gray-700">
            Page Size:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // reset to first page
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Full Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Teacher Approved</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="py-3 px-6">{user.fullName}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  {user.isTeacherApproved ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>
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

      {/* Numeric Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded ${
              num === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
