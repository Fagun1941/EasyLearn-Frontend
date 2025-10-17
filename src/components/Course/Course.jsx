import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(5); // default page size
  const navigate = useNavigate();

  const fetchCourses = async (pageNumber = 1, query = "", size = pageSize) => {
    try {
      const response = await api.get(
        `/Course/GetAll?page=${pageNumber}&pageSize=${size}&search=${query}`
      );
      const items = response.data.items ?? response.data;
      setCourses(items);
      setTotalPages(response.data.totalPages ?? 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses(page, searchTerm, pageSize);
  }, [pageSize]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(1, searchTerm, pageSize);
  };

  const handlePrevious = () => {
    if (page > 1) {
      fetchCourses(page - 1, searchTerm, pageSize);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      fetchCourses(page + 1, searchTerm, pageSize);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Course Management</h2>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Page Size Dropdown */}
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border p-2 rounded-lg"
        >
          {[5, 10, 15, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        {/* Add Button */}
        <button
          onClick={() => navigate("/course/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Course
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="border rounded-xl shadow-lg p-6 bg-white flex flex-col items-center text-center"
          >
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-700 font-medium mb-2">
              Price: ${course.price}
            </p>
            <p className="text-gray-500 font-medium">
              Written by: {course.teacherName}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500 text-white"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchCourses(p, searchTerm, pageSize)}
              className={`px-3 py-1 rounded ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {courses.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No courses found.</p>
      )}
    </div>
  );
};

export default Course;
