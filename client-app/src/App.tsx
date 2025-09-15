import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

const App: React.FC = () => {
  const hostname = window.location.hostname;
  const isAdmin = hostname.startsWith("admin.");

  return (
    <Router>
      {/* Only show Navbar if NOT on admin subdomain */}
      {!isAdmin && <Navbar />}

      <div className={!isAdmin ? "pt-20" : ""}>
        <AppRoutes />
      </div>

      {/* Only show Footer if NOT on admin subdomain */}
      {!isAdmin && <Footer />}
    </Router>
  );
};

export default App;
