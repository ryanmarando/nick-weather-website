import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Nick Dunn. All rights reserved.
        </p>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            GitHub
          </a>
          <a
            href="/contact"
            className="hover:text-blue-400 transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
