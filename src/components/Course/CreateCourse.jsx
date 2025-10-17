import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  // Fetch all categories and teachers for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryRes = await api.get("/CategoryCourse/GetAll");
        setCategories(categoryRes.data);

        // Fetch teachers
        const teacherRes = await api.get("/Admin/teachers");
        setTeachers(teacherRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Error fetching dropdown data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  // Handle course creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId || !teacherId) {
      alert("Please select both category and teacher.");
      return;
    }

    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        categoryCourseId: parseInt(categoryId),
        teacherId: teacherId,
      };

      await api.post("/Course/Create", payload);

      alert("✅ Course created successfully!");
      navigate("/course");
    } catch (error) {
      console.error(`Bearer ${localStorage.getItem("token")}`);
      console.error("Failed to create course:", error);
      alert("❌ Failed to create course. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Create Course
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Course Title */}
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            required
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Category Dropdown */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryCourseId} value={cat.categoryCourseId}>
                {cat.categoryCourseName}
              </option>
            ))}
          </select>

          {/* Teacher Dropdown */}
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex-1"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => navigate("/course")}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
