import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Account/Login";
import Register from "../components/Account/Register";
import Home from "../components/Home/Home";
import Category from "../components/Category/Categrory";
import Course from "../components/Course/Course";
import CreateCourse from "../components/Course/CreateCourse";
import CourseDetails from "../components/Course/CourseDetails";
import CourseEdit from "../components/Course/CourseEdit";
import Layout from "../components/Layout/Layout";
import MyCourse from "../components/Course/MyCourse";
import Dashboard from "../components/Admin/Dashbord";
import AllUsers from "../components/Admin/AllUsrs";
import TeacherList from "../components/Admin/TeacherList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/create" element={<CreateCourse />} />
        <Route path="/course/details/:id" element={<CourseDetails />} />
        <Route path="/course/edit/:id" element={<CourseEdit />} />
        <Route path="/my-course" element={<MyCourse />} />
        <Route path="/Admin" element={<Dashboard />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/TeacherList" element={<TeacherList />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
