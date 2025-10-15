import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Account/Login";
import Register from "../components/Account/Register";
import Home from "../components/Home/Home";
import Category from "../components/Category/Categrory";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/category" element={<Category />} />
    </Routes>
  );
};

export default AppRoutes;
