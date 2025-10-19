import api from "../../api/axiosConfig";

export const deleteCourse = async (courseId) => {
  try {
    alert("Deleting course with ID: " + courseId);
    await api.delete(`/Course/Delete/${courseId}`);
    alert("Course deleted!");
  } catch (error) {
    console.error("Delete course failed:", error);
    alert("Failed to delete course");
  }
};
