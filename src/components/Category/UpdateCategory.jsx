import api from "../../api/axiosConfig";

export const updateCategory = async (categoryId, newName, description) => {
  try {
    await api.put(`/CategoryCourse/UpdateCategory`, {
      categoryCourseId: categoryId,
      categoryCourseName: newName,
      courseDescription: description,
    });
    alert("Category updated!");
  } catch (error) {
    alert("Failed to update category");
  }
};
