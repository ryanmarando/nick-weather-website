import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Blog from "./pages/Blog";
import Broadcasting from "./pages/Broadcasting";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes: React.FC = () => {
  const hostname = window.location.hostname;

  // If hostname starts with "admin.", render admin routes
  if (hostname.startsWith("admin.")) {
    return (
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        {/* Add more admin routes here */}
      </Routes>
    );
  }

  // Normal site routes
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/broadcasting" element={<Broadcasting />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;
