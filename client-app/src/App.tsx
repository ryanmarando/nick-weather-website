import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home";
import Blog from "./pages/Blog"
import Broadcasting from "./pages/Broadcasting";
import Resume from "./pages/Resume";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* Padding for fixed navbar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/broadcasting" element={<Broadcasting />} />
          <Route path="/resume" element={<Resume />} />
          {/* Add routes for Blogs, Resume, Broadcasting */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
