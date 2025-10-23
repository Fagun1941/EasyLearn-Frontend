import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { deleteCourse } from "./DeleteCourse";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/Course/GetById/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      alert("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        alert("Course deleted successfully!");
        navigate("/course"); 
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course");
      }
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  if (!course) {
    return <p className="text-center mt-8 text-gray-500">Course not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>

        <div className="space-y-3 text-gray-700">
          <p><strong>Category:</strong> {course.categoryName}</p>
          <p><strong>Teacher:</strong> {course.teacherName}</p>
          <p><strong>Price:</strong> ${course.price}</p>
          <p><strong>Description:</strong> {course.description}</p>
          <strong>Enrolled:</strong> {course.numberofEnroll??0}/{course.maxNumberEnroll }
          
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(`/course/edit/${id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={() => navigate("/course")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Back
          </button>

           <button
            onClick={() => navigate(`/course/${id}/enrollment`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Enrollment Person
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
