import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <AppRoutes />
      </div>
      <Footer />
    </Router>
  );
};

export default App;
