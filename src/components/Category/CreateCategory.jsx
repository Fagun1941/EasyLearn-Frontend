import api from "../../api/axiosConfig";

export const createCategory = async (name, description) => {
  try {
    await api.post("/CategoryCourse/CreateCategory", {
      categoryCourseName: name,
      courseDescription: description,
    });
    alert("Category added!");
  } catch (error) {
    alert("Failed to add category");
  }
};
