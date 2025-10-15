import api from "../../api/axiosConfig";

export const deleteCategory = async (id, refreshCallback) => {
  if (window.confirm("Are you sure you want to delete this category?")) {
    try {
      await api.delete(`/CategoryCourse/DeleteCategory/${id}`);
      alert("Category deleted!");
      refreshCallback();
    } catch (error) {
      alert("Failed to delete category");
    }
  }
};
