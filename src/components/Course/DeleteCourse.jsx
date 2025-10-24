import api from "../../api/axiosConfig";

export const deleteCourse = async (courseId) => {
  try {
    await api.delete(`/Course/Delete/${courseId}`);
  } catch (error) {
    console.error("Delete course failed:", error);
    alert("Failed to delete course");
  }
};
