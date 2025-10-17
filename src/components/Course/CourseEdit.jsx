import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

/**
 * Robust CourseEdit component:
 * - Loads category list from /CategoryCourse/GetAll (handles multiple shapes)
 * - Loads course details from /Course/GetById/{id} (handles several shapes)
 * - Normalizes data and pre-selects category in dropdown
 * - Submits PUT /Course/Update with required payload
 */

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    courseId: 0,
    title: "",
    description: "",
    price: 0,
    categoryCourseId: 0,
  });

  const [categories, setCategories] = useState([]); // normalized: { id, name }
  const [loading, setLoading] = useState(true);

  // normalize categories returned from backend into { id, name }
  const normalizeCategories = (raw) => {
    if (!raw) return [];
    // If API returns paged response: { items: [...] }
    const list = Array.isArray(raw) ? raw : raw.items ?? raw;
    if (!Array.isArray(list)) return [];

    return list.map((c) => {
      // try a few common property names
      const id =
        c.categoryCourseId ??
        c.categoryId ??
        c.id ??
        (c.CategoryCourseId ?? undefined); // fallbacks
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
      // use CategoryCourse endpoint (you used this in backend)
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

  // fetch single course and try to extract category id
  const fetchCourse = async (cats = []) => {
    try {
      const res = await api.get(`/Course/GetById/${id}`);
      const data = res.data;
      console.log("Course data from API:", data);

      // try several ways to get categoryCourseId
      let categoryCourseId =
        data.categoryCourseId ??
        data.categoryCourse?.categoryCourseId ??
        data.categoryCourse?.id ??
        data.categoryId ??
        data.category?.categoryCourseId ??
        data.category?.id ??
        null;

      // if server only returns categoryName, try to find id from categories
      if (!categoryCourseId && data.categoryName) {
        const found = cats.find(
          (c) =>
            String(c.name).toLowerCase() === String(data.categoryName).toLowerCase()
        );
        if (found) categoryCourseId = found.id;
      }

      // Some APIs return category object in different casing. Try to match by any nested name
      if (!categoryCourseId) {
        // attempt to match by any name-like field inside data.categoryCourse or data.category
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

      // As a last resort, try to match by categoryName to categories list again:
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
    // load categories then course (so we can try matching by name if needed)
    (async () => {
      setLoading(true);
      const cats = await fetchCategories();
      await fetchCourse(cats);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if number fields, keep numeric type except empty string
    setCourse((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "categoryCourseId"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate required
    if (!course.title || course.categoryCourseId === 0 || course.categoryCourseId === "") {
      alert("Please fill title and select a category.");
      return;
    }

    try {
      // Build payload expected by your PUT /Course/Update
      const payload = {
        courseId: Number(course.courseId),
        title: course.title,
        description: course.description,
        price: Number(course.price),
        categoryCourseId: Number(course.categoryCourseId),
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
          {/* Title */}
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

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Price */}
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

          {/* Category Dropdown */}
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

          {/* Buttons */}
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
