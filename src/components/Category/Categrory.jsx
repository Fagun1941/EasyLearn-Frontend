import React, { useEffect, useState } from "react";
import { createCategory } from "./CreateCategory";
import { updateCategory } from "./UpdateCategory";
import { deleteCategory } from "./DeleteCategory";
import api from "../../api/axiosConfig";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null); 

  const fetchCategories = async () => {
    try {
      const response = await api.get("/CategoryCourse/GetAll");
      setCategories(response.data);
    } catch (error) {
      alert("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategory(editId, name, description);
      } else {
        await createCategory(name, description);
      }
      clearForm();
      fetchCategories();
    } catch (error) {
      alert("Action failed");
    }
  };

  const handleEdit = (category) => {
    setName(category.categoryCourseName);
    setDescription(category.categoryDescription);
    setEditId(category.categoryCourseId); 
  };

  const handleDelete = (categoryId) => {
    deleteCategory(categoryId, fetchCategories);
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Create Category</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full border-collapse shadow-md">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryCourseId} className="text-center">
              <td className="p-2 border">{category.categoryCourseName}</td>
              <td className="p-2 border">{category.categoryDescription}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.categoryCourseId)}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
