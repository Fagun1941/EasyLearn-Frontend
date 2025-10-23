import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";


const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseId: 0,
    title: "",
    description: "",
    price: 0,
    categoryCourseId: 0,
    maxNumberEnroll: 0,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeCategories = (raw) => {
    if (!raw) return [];
    const list = Array.isArray(raw) ? raw : raw.items ?? raw;
    if (!Array.isArray(list)) return [];

    return list.map((c) => {
      const id =
        c.categoryCourseId ??
        c.categoryId ??
        c.id ??
        (c.CategoryCourseId ?? undefined); 
      const name =
        c.categoryCourseName ??
        c.categoryName ??
        c.name ??
        c.CategoryCourseName ??
        c.CategoryName ??
        (c.category_description ? String(c.category_description) : undefined);

      return { id: id ?? 0, name: name ?? "Unnamed category", raw: c };
    });
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/CategoryCourse/GetAll");
      const normalized = normalizeCategories(res.data);
      setCategories(normalized);
      console.log("Loaded categories:", normalized);
      return normalized;
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to load categories.");
      return [];
    }
  };

  const fetchCourse = async (cats = []) => {
    try {
      const res = await api.get(`/Course/GetById/${id}`);
      const data = res.data;
      console.log("Course data from API:", data);

      let categoryCourseId =
        data.categoryCourseId ??
        data.categoryCourse?.categoryCourseId ??
        data.categoryCourse?.id ??
        data.categoryId ??
        data.category?.categoryCourseId ??
        data.category?.id ??
        null;

      if (!categoryCourseId && data.categoryName) {
        const found = cats.find(
          (c) =>
            String(c.name).toLowerCase() === String(data.categoryName).toLowerCase()
        );
        if (found) categoryCourseId = found.id;
      }

      if (!categoryCourseId) {
        const nestedCategory =
          data.categoryCourse ?? data.category ?? data.CategoryCourse ?? data.Category;
        if (nestedCategory) {
          categoryCourseId =
            nestedCategory.categoryCourseId ??
            nestedCategory.categoryId ??
            nestedCategory.id ??
            null;
        }
      }

      if (!categoryCourseId && cats.length > 0 && data.categoryName) {
        const found = cats.find(
          (c) => String(c.name).toLowerCase() === String(data.categoryName).toLowerCase()
        );
        if (found) categoryCourseId = found.id;
      }

      setCourse({
        courseId: data.courseId ?? data.id ?? Number(id),
        title: data.title ?? data.name ?? "",
        description: data.description ?? data.desc ?? "",
        price: data.price ?? 0,
        categoryCourseId: categoryCourseId ?? 0,
        maxNumberEnroll: data.maxNumberEnroll ?? 0,
      });

      console.log("Normalized course state:", {
        ...data,
        resolvedCategoryId: categoryCourseId,
      });
    } catch (err) {
      console.error("Failed to fetch course details:", err);
      alert("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const cats = await fetchCategories();
      await fetchCourse(cats);
      setLoading(false);
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "categoryCourseId" || name === "maxNumberEnroll"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title || course.categoryCourseId === 0 || course.categoryCourseId === "") {
      alert("Please fill title and select a category.");
      return;
    }

    try {
      const payload = {
        courseId: Number(course.courseId),
        title: course.title,
        description: course.description,
        price: Number(course.price),
        categoryCourseId: Number(course.categoryCourseId),
        maxNumberEnroll: Number(course.maxNumberEnroll),
      };

      console.log("Sending update payload:", payload);
      await api.put("/Course/Update", payload);
      alert("Course updated successfully!");
      navigate("/course");
    } catch (err) {
      console.error("Failed to update course:", err);
      alert("Failed to update course.");
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Course</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              name="categoryCourseId"
              value={course.categoryCourseId ?? ""}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id ?? cat.raw?.categoryCourseId ?? cat.raw?.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Max Number of Enroll</label>
            <input
              type="number"
              name="maxNumberEnroll"
              value={course.maxNumberEnroll}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/course")}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit;
